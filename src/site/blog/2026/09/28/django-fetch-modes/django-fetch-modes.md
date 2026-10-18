# Django fetch modes

Django 6.1 was [released](https://docs.djangoproject.com/en/6.1/releases/6.1/) recently (2026.08.05) and introduced [fetch modes](https://docs.djangoproject.com/en/6.1/topics/db/fetch-modes/) support.

**My claim in this article is that default options are not useful. But it's very easy to log n+1 query problems.**

Syntax is trivial to be added at **model level** (it SEEMS that could be good to have it on global level, but this could have unforseen side effects on your 10 third party apps and break code in so subtle way that you won't see it easly, example later!)

```python
class BookManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().fetch_mode(...)


class Book(models.Model):
    ...

    objects = BookManager()
```

Two new available modes (as FETCH_ONE represents Django's behaviour before 6.1) seems cool at first, but they are not really.

## FETCH_RAISE

`FETCH_RAISE` is in fact killer option, I doubt anybody would dare to use it in production. This is just too much, you WILL end up with 500 errors sooner or later (I would say that it will be sooner, aka next minute after deployment). Basically: "I am 100% sure my app doesn't contain any hidden n+1 bug". Not true, after certain number of features times number of people who work on the project this WILL happen.

Please don't use it, don't detonate your app.

Not to mention that trying to adapt it for certain number of tests seems just not doable unless you spend week adapting them (what for, I don't know, who cares if your tests contain certain n+1 problems).

## FETCH_PEERS

My problems with `FETCH_PEERS` are following:

- You are **not** going to use it on purpose, since you are very good programmer and would use `select_related` and `prefetch_related` instead on your own.
- Then this means automatically that it will **hide some real BUG** in your code by definition (or in best case do nothing).
- So, instead of using [assert_num_queries](https://pytest-django.readthedocs.io/en/latest/helpers.html#django-assert-num-queries) (or `assertNumQueries` at your option) in risky places where bug can happen and in general writting good performant code, you are using hack to save you.
- Not always this will be best option. If you look on [actual implementation](https://github.com/django/django/blob/6.1/django/db/models/fetch_modes.py#L31-L40), this is in fact `prefetch_related`. There are many cases where `select_related` would be more natural and just better.
- Even if `prefetch_related` **should** be quite safe to applicate in various places (as django deduplicate fetched objects) I can imagine and am pretty sure in the wild there will be cases where some (buggy as hell at your option) code will break after adding it.

## FETCH_ERROR???

My own thinking is that I don't like either to detonate my applications nor hide (or silently introduce) bugs so both `FETCH_RAISE` and `FETCH_PEERS` are non go.

It's OK for me to flag some problems and I can fix them myself. Logging error or warning – this is the way.

Thanfully, it's super easy to do (as always in Django :)

```python
import inspect
import logging
from typing import Any

from django.conf import settings
from django.db.models import Manager, Model
from django.db.models.fetch_modes import FetchOne

log = logging.getLogger(__name__)


class FetchError(FetchOne):
    __slots__ = ()

    track_peers = False

    def fetch(self, fetcher: Any, instance: Model) -> None:
        klass = instance.__class__.__qualname__
        field_name = fetcher.field.name

        if not settings.TESTING and not self._is_django_admin_call():
            log.error("Unexpected fetch of %s.%s.", klass, field_name, stack_info=True)

        return super().fetch(fetcher, instance)

    def _is_django_admin_call(self) -> bool:
        # Walk frame back pointers directly to avoid inspect.stack shadowing issues
        frame = inspect.currentframe()
        try:
            depth = 0
            while frame and depth < 20:
                module_name = frame.f_globals.get("__name__", "")
                if module_name.startswith("django.contrib.admin"):
                    return True
                frame = frame.f_back
                depth += 1
        finally:
            del frame  # Avoid reference cycle retention
        return False

    def __reduce__(self):
        return "FETCH_ERROR"


FETCH_ERROR = FetchError()


class FetchErrorManager(Manager):
    def get_queryset(self):
        return super().get_queryset().fetch_mode(FETCH_ERROR)
```


## Be careful fixing n+1

Here is [permalink](https://github.com/rafsaf/Tribal-Wars-Planer/blob/f8f96d537591b5e7d554e59b57e56bacc6d8cc53/rest_api/views.py#L154-L185) if you need more context, but it's simple endpoint that deletes `Target` object with related children called `WeightModel` that have FK to model `WeightMaximum`. It's real code, written by my jounger self years ago. It is as it is, works fine (well, unless you remove n+1 problem in naive way!).

```python
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_target(request: Request):
    """
    For given target id, delete obj.
    """
    req = TargetDeleteSerializer(data=request.data)  # type: ignore
    if req.is_valid():
        target: TargetVertex = get_object_or_404(
            TargetVertex.objects.select_related("outline"),
            pk=req.data.get("target_id"),
            outline__owner=request.user,
        )
        with transaction.atomic():
            weights = WeightModel.objects.filter(target=target)
            # deletes weights related to this target and updates weight state
            weight_model: WeightModel
            for weight_model in weights:
                state: WeightMaximum = weight_model.state
                state.off_left += weight_model.off
                state.off_state -= weight_model.off
                state.nobleman_left += weight_model.nobleman
                state.nobleman_state -= weight_model.nobleman
                state.catapult_left += weight_model.catapult
                state.catapult_state -= weight_model.catapult
                state.save()

            weights.delete()
            target.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(req.errors, status=status.HTTP_400_BAD_REQUEST)
```

It has 2x query per loop iteration – `weight_model.state` will fetch related model and `state.save()` save it after update. My first thought was that maybe I can live with additional `save()` as those targets has usually up to dozen children and users ralely use this endpoint (not going to go into the details here as it will be boring). Let's simply add `select_related`:

```diff
with transaction.atomic():
-   weights = WeightModel.objects.filter(target=target)
+   weights = WeightModel.objects.filter(target=target).select_related("state")
    # deletes weights related to this target and updates weight state
    weight_model: WeightModel
    for weight_model in weights:
        state: WeightMaximum = weight_model.state
        state.off_left += weight_model.off
        state.off_state -= weight_model.off
        state.nobleman_left += weight_model.nobleman
        state.nobleman_state -= weight_model.nobleman
        state.catapult_left += weight_model.catapult
        state.catapult_state -= weight_model.catapult
        state.save()
```

Do you see the bug? [The proof is left as an exercise for the reader](https://en.wikipedia.org/wiki/Proof_by_intimidation). Hint after nice 2 bug images.



![ładny-różowy-uśmiechnięty-robak-na-białym-tle-40980137.jpg](./ładny-różowy-uśmiechnięty-robak-na-białym-tle-40980137.jpg)

<small>Attribution: https://www.istockphoto.com</small>

![istockphoto-1994315317-612x612.jpg](./istockphoto-1994315317-612x612.jpg)

<small>Attribution: https://www.istockphoto.com</small>

Hint: each `weight_model` modify `state` parent. What if `state` is the very same parent for two different `weight_model` from queryset? In fact n+1 is a reason that this piece of code is (relatively to be honest, seen better) ok.

---

Last updated: 2026-09-28

Content license: CC BY-NC 4.0 — share and adapt with attribution, no commercial use.

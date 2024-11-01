import jinja2
import pathlib
import shutil

root_dir = pathlib.Path(__file__).resolve().parent
src = root_dir / "src"
site = src / "site"
out = root_dir / "out"


def process_path(p: pathlib.Path) -> None:
    rel_src = p.relative_to(src)
    rel_site = p.relative_to(site)

    out_file = out / rel_site
    out_file.parent.mkdir(parents=True, exist_ok=True)

    if p.is_file() and p.name.endswith(".html"):
        content = environment.get_template(str(rel_src)).render()
    elif p.is_dir():
        for nested_path in p.iterdir():
            process_path(nested_path)
        return
    else:
        content = p.read_bytes()
        out_file.write_bytes(content)
        return

    out_file.write_text(content)


if __name__ == "__main__":
    try:
        shutil.rmtree(out)
    except FileNotFoundError:
        pass

    out.mkdir()

    environment = jinja2.Environment(loader=jinja2.FileSystemLoader(src))

    for path in site.iterdir():
        process_path(path)

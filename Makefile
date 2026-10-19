.PHONY: watch
watch:
	uv run watchfiles "python template.py" src template.py

.PHONY: update-highlightjs
update-highlightjs:
	@echo "Downloading highlight.js 11-stable build folder..."
	@rm -rf src/site/_data/js/@highlightjs
	@git clone --depth 1 --branch 11-stable git@github.com:highlightjs/cdn-release.git .tmp-highlightjs
	@mkdir -p src/site/_data/js/@highlightjs
	@cp -R .tmp-highlightjs/build/. src/site/_data/js/@highlightjs/
	@rm -rf .tmp-highlightjs
	@echo "Done! Build files successfully placed in src/site/_data/js/@highlightjs"

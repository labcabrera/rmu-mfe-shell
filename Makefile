REMOTE          ?= origin
MASTER_BRANCH   ?= master
DEVELOP_BRANCH  ?= develop
RELEASE_BUMP    ?=
SHARED_LIB_DIR  ?= ../rmu-react-shared-lib
SHARED_LIB_NAME ?= @labcabrera-rmu/rmu-react-shared-lib

.DEFAULT_GOAL := help
.PHONY: help build link-shared-lib unlink-shared-lib create-release

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

build: ## Build the production bundle into dist/
	npm run build

link-shared-lib: ## Build the local rmu-react-shared-lib checkout (SHARED_LIB_DIR) and link it into node_modules
	@test -f "$(SHARED_LIB_DIR)/package.json" || { echo "Missing $(SHARED_LIB_DIR). Set SHARED_LIB_DIR to your rmu-react-shared-lib checkout." >&2; exit 1; }
	npm --prefix "$(SHARED_LIB_DIR)" run build
	npm link --no-save "$(SHARED_LIB_DIR)"
	@echo "Linked $(SHARED_LIB_NAME) from $(SHARED_LIB_DIR). Run 'make unlink-shared-lib' to restore the registry version."

unlink-shared-lib: ## Remove the local link and reinstall dependencies from package-lock.json
	npm unlink --no-save "$(SHARED_LIB_NAME)"
	npm install

create-release: ## Release develop to master with semantic-release (tag + CHANGELOG), push, and bump develop to next -SNAPSHOT. Optional RELEASE_BUMP=patch|minor|major
	@test "$$(git branch --show-current)" = "$(DEVELOP_BRANCH)" || { echo "Releases must start from '$(DEVELOP_BRANCH)' (current: $$(git branch --show-current))" >&2; exit 1; }
	@test -z "$$(git status --porcelain)" || { echo "Working directory is not clean:" >&2; git status --short >&2; exit 1; }
	git fetch --tags $(REMOTE)
	git pull --ff-only $(REMOTE) $(DEVELOP_BRANCH)
	git checkout $(MASTER_BRANCH) 2>/dev/null || git checkout -b $(MASTER_BRANCH) --track $(REMOTE)/$(MASTER_BRANCH)
	git pull --ff-only $(REMOTE) $(MASTER_BRANCH)
	git merge --no-ff --no-edit -m "Merge branch '$(DEVELOP_BRANCH)' into $(MASTER_BRANCH)" $(DEVELOP_BRANCH)
	@RELEASE_BUMP="$(RELEASE_BUMP)" npx --no -- semantic-release --no-ci \
		&& git describe --exact-match --tags HEAD >/dev/null 2>&1 \
		|| { echo "No release was created, restoring $(MASTER_BRANCH) and returning to $(DEVELOP_BRANCH)" >&2; \
			git reset -q --hard $(REMOTE)/$(MASTER_BRANCH); git checkout -q $(DEVELOP_BRANCH); exit 1; }
	git checkout $(DEVELOP_BRANCH)
	git merge --no-edit $(MASTER_BRANCH)
	@version=$$(node -p "require('./package.json').version"); \
		next=$$(npx --no -- semver -i patch "$$version")-SNAPSHOT; \
		npm version --no-git-tag-version "$$next" >/dev/null \
		&& git commit -q -m "chore: prepare next development version $$next" package.json package-lock.json \
		&& echo "Released $$version, $(DEVELOP_BRANCH) is now at $$next"
	git push $(REMOTE) $(DEVELOP_BRANCH)

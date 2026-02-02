.PHONY: tokens render render-fast preview deps clean

# Prefer a sysctl-free Quarto launcher (Quarto's upstream launcher script calls
# sysctl on macOS, which is blocked in some sandboxed environments).
QUARTO := ./scripts/quarto-sandbox

# Use the astro conda environment for Python tooling (brand token generation).
CONDA_ENV ?= astro
ifeq ($(CONDA_DEFAULT_ENV),$(CONDA_ENV))
PYTHON := python
PIP := pip
else
PYTHON := conda run -n $(CONDA_ENV) python
PIP := conda run -n $(CONDA_ENV) pip
endif

# Install dev dependencies
deps:
	$(PIP) install -r scripts/requirements-dev.txt

# Generate SCSS tokens from brand
tokens:
	$(PYTHON) scripts/brand_to_scss.py

# Render site (regenerates tokens first)
render: tokens
	$(QUARTO) render

# Fast render (HTML only) — skips PDF builds (latex), but still renders the full project.
render-fast: tokens
	$(QUARTO) render --to html

# Preview site
preview: tokens
	$(QUARTO) preview

# Clean generated artifacts
clean:
	rm -rf _site .quarto

.PHONY: tokens render preview deps clean

# Install dev dependencies
deps:
	pip install -r scripts/requirements-dev.txt

# Generate SCSS tokens from brand
tokens:
	python3 scripts/brand_to_scss.py

# Render site (regenerates tokens first)
render: tokens
	quarto render

# Preview site
preview: tokens
	quarto preview

# Clean generated artifacts
clean:
	rm -rf _site .quarto

#!/usr/bin/env ruby
# frozen_string_literal: true

require "html-proofer"

directory = ARGV.fetch(0, "_site")

ignore_urls = [
  %r{\Ahttps://docs\.google\.com/.*},
  %r{\Ahttps://(?:www\.)?astrobites\.org(?:/.*)?\z},
  %r{\Ahttps://www\.cambridge\.org/9781009618007.*\z},
  %r{\Ahttps://shopaztecs\.com/.*},
  %r{\Ahttps://viewspace\.org(?:/.*)?\z},
  %r{\A#/.*}
]

options = {
  # Quarto uses <a> tags as UI toggles (sidebar/theme) without href attributes.
  allow_missing_href: true,
  # Allow decorative images to omit alt text while we keep link/image integrity checks.
  ignore_empty_alt: true,
  ignore_missing_alt: true,
  # Match the previous proof-html behavior of checking rendered pages plus Open Graph assets.
  checks: %w[Links Images Scripts OpenGraph],
  # External URLs that block automated access or use RevealJS-only hash navigation.
  ignore_urls: ignore_urls
}

HTMLProofer.check_directory(directory, options).run

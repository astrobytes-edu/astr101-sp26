#!/usr/bin/env ruby
# frozen_string_literal: true

def htmlproofer_ignore_urls
  [
    %r{\Ahttps://docs\.google\.com/.*},
    %r{\Ahttps://(?:www\.)?astrobites\.org(?:/.*)?\z},
    %r{\Ahttps://www\.cambridge\.org/9781009618007.*\z},
    %r{\Ahttps://shopaztecs\.com/.*},
    %r{\Ahttps://viewspace\.org(?:/.*)?\z},
    %r{\A#/.*}
  ]
end

def build_htmlproofer_options(check_external: true)
  {
    # Quarto uses <a> tags as UI toggles (sidebar/theme) without href attributes.
    allow_missing_href: true,
    # Allow decorative images to omit alt text while we keep link/image integrity checks.
    ignore_empty_alt: true,
    ignore_missing_alt: true,
    # Match the previous proof-html behavior of checking rendered pages plus Open Graph assets.
    checks: %w[Links Images Scripts OpenGraph],
    # External URLs that block automated access or use RevealJS-only hash navigation.
    ignore_urls: htmlproofer_ignore_urls,
    # External links are valuable for scheduled patrols, but too flaky to gate normal CI.
    disable_external: !check_external
  }
end

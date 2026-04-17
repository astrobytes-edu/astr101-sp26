#!/usr/bin/env ruby
# frozen_string_literal: true

require_relative "htmlproofer_options"

if $PROGRAM_NAME == __FILE__
  require "html-proofer"

  directory = ARGV.fetch(0, "_site")
  check_external = ENV.fetch("CI_CHECK_EXTERNAL_LINKS", "1") == "1"
  options = build_htmlproofer_options(check_external: check_external)

  HTMLProofer.check_directory(directory, options).run
end

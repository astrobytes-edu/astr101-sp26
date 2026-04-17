require "minitest/autorun"

require_relative "../scripts/htmlproofer_options"

class RunHtmlProoferOptionsTest < Minitest::Test
  def test_disables_external_checks_when_env_requests_it
    options = build_htmlproofer_options(check_external: false)

    assert_equal true, options[:disable_external]
  end

  def test_keeps_external_checks_enabled_when_requested
    options = build_htmlproofer_options(check_external: true)

    refute options[:disable_external]
  end
end

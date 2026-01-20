-- Demo shortcode for embedding interactive astronomy demos
-- Usage: {{< demo angular-size >}}
-- Usage: {{< demo angular-size height="500px" >}}

function demo(args, kwargs, meta)
  -- Get the demo name from first argument
  local name = pandoc.utils.stringify(args[1])
  if not name or name == "" then
    quarto.log.warning("Demo shortcode requires a demo name")
    return pandoc.Null()
  end

  -- Get optional height (default 500px)
  local height = "500px"
  if kwargs["height"] then
    height = pandoc.utils.stringify(kwargs["height"])
  end

  -- Get optional width (default 100%)
  local width = "100%"
  if kwargs["width"] then
    width = pandoc.utils.stringify(kwargs["width"])
  end

  -- Build the iframe URL (relative path to demos folder)
  -- In Quarto, we need to calculate the relative path from current doc to demos/
  local src = "/demos/" .. name .. "/index.html"

  -- Create the iframe HTML
  local iframe_html = string.format([[
<div class="demo-embed" style="width: %s; margin: 1rem 0;">
  <iframe
    src="%s"
    width="100%%"
    height="%s"
    style="border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; background: #0a0a14;"
    loading="lazy"
    title="%s Demo"
    allow="fullscreen">
  </iframe>
  <p style="text-align: center; margin-top: 0.5rem; font-size: 0.875rem; color: #666;">
    <a href="%s" target="_blank" style="color: #5dade2;">Open in new tab ↗</a>
  </p>
</div>
]], width, src, height, name, src)

  return pandoc.RawBlock('html', iframe_html)
end

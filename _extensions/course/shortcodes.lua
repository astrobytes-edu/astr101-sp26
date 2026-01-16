-- Course-specific shortcodes for ASTR 201
-- Usage: {{< shortcode arg1 arg2 >}}

-- {{< due "2026-02-15" >}} → "**Due:** Feb 15, 2026"
-- Formats a due date prominently
function due(args)
  local date_str = args[1] or "TBD"
  return pandoc.Strong({pandoc.Str("Due: " .. date_str)})
end

-- {{< points 10 >}} → "(10 points)"
-- Shows point value for an assignment/question
function points(args)
  local pts = args[1] or "?"
  local label = tonumber(pts) == 1 and " point" or " points"
  return pandoc.Emph({pandoc.Str("(" .. pts .. label .. ")")})
end

-- {{< reading "Chapter 3" "pp. 45-62" >}} → "📖 Chapter 3, pp. 45-62"
-- Formats a reading assignment
function reading(args)
  local chapter = args[1] or ""
  local pages = args[2] or ""
  local text = chapter
  if pages ~= "" then
    text = text .. ", " .. pages
  end
  return pandoc.Span({pandoc.Str(text)}, {class = "reading-ref"})
end

-- {{< exam "Midterm 1" >}} → styled exam reference
function exam(args)
  local name = args[1] or "Exam"
  return pandoc.Strong({pandoc.Str(name)})
end

-- {{< week 3 >}} → "Week 3"
-- For schedule references
function week(args)
  local num = args[1] or "?"
  return pandoc.Str("Week " .. num)
end

-- {{< canvas "assignments" >}} → link to Canvas section
-- Generates Canvas deep link
function canvas(args)
  local section = args[1] or ""
  local url = "https://sdsu.instructure.com"
  local text = "Canvas"
  if section ~= "" then
    text = "Canvas " .. section
  end
  return pandoc.Link(text, url, "", {class = "canvas-link"})
end

-- {{< office-hours >}} → shows office hours from params
-- Pulls from metadata
function office_hours(args, kwargs, meta)
  local oh = "See syllabus"
  if meta and meta.params and meta.params["office-hours"] then
    oh = pandoc.utils.stringify(meta.params["office-hours"])
  end
  return pandoc.Str(oh)
end

-- {{< instructor >}} → shows instructor name from params
function instructor(args, kwargs, meta)
  local name = "Instructor"
  if meta and meta.params and meta.params["instructor"] then
    name = pandoc.utils.stringify(meta.params["instructor"])
  end
  return pandoc.Str(name)
end

-- {{< email >}} → mailto link to instructor
function email(args, kwargs, meta)
  local addr = "instructor@example.com"
  if meta and meta.params and meta.params["email"] then
    addr = pandoc.utils.stringify(meta.params["email"])
  end
  return pandoc.Link(addr, "mailto:" .. addr)
end

-- {{< semester >}} → shows semester from params
function semester(args, kwargs, meta)
  local sem = "Current Semester"
  if meta and meta.params and meta.params["semester"] then
    sem = pandoc.utils.stringify(meta.params["semester"])
  end
  return pandoc.Str(sem)
end

-- ==============================================================
-- Figure shortcode - renders figures from central registry
-- ==============================================================

-- Helper function to parse figure data from YAML file
local function load_figure_registry()
  local registry = {}

  -- Try to find the figures.yml file from project root
  -- Quarto sets QUARTO_PROJECT_DIR when running
  local project_dir = os.getenv("QUARTO_PROJECT_DIR") or "."
  local registry_path = project_dir .. "/assets/figures.yml"

  local f = io.open(registry_path, "r")
  if not f then
    -- Fallback: try relative path (works from project root)
    f = io.open("assets/figures.yml", "r")
  end
  if not f then
    return registry
  end

  local content = f:read("*all")
  f:close()

  -- Parse YAML manually (simplified parser for our specific format)
  local current_fig = nil
  for line in content:gmatch("[^\n]+") do
    -- Skip comments and empty lines
    if not line:match("^%s*#") and not line:match("^%s*$") then
      -- Check for figure ID (two spaces + name + colon)
      local fig_id = line:match("^  ([%w%-]+):%s*$")
      if fig_id then
        current_fig = fig_id
        registry[current_fig] = {}
      elseif current_fig then
        -- Parse properties (four spaces + key: value)
        local key, value = line:match("^    ([%w%-]+):%s*(.+)$")
        if key and value then
          -- Remove quotes if present
          value = value:gsub('^"(.+)"$', "%1")
          value = value:gsub("^'(.+)'$", "%1")
          registry[current_fig][key] = value
        end
      end
    end
  end

  return registry
end

-- Cache the registry to avoid re-reading on every shortcode call
local _figure_registry = nil
local function get_figure_registry()
  if not _figure_registry then
    _figure_registry = load_figure_registry()
  end
  return _figure_registry
end

-- {{< fig id >}} or {{< fig id caption="Custom caption" >}}
-- Renders figure from central registry with optional caption override
function fig(args, kwargs)
  local fig_id = args[1]
  if not fig_id then
    return pandoc.Strong({pandoc.Str("[ERROR: fig shortcode requires figure ID]")})
  end

  local registry = get_figure_registry()
  local fig_data = registry[fig_id]

  if not fig_data then
    return pandoc.Strong({pandoc.Str("[ERROR: Figure '" .. fig_id .. "' not found in registry]")})
  end

  -- Get figure properties
  local path = fig_data.path or ""
  local caption = fig_data.caption or ""
  local alt = fig_data.alt or caption
  local credit = fig_data.credit

  -- Allow caption override via kwargs
  if kwargs and kwargs.caption then
    caption = pandoc.utils.stringify(kwargs.caption)
  end

  -- Build full caption with credit if present
  local full_caption = caption
  if credit then
    full_caption = caption .. " (Credit: " .. credit .. ")"
  end

  -- Create image element with alt text
  local img = pandoc.Image({pandoc.Str(alt)}, path)

  -- Create a div containing image and caption (simpler, more portable than Figure)
  local caption_para = pandoc.Para({pandoc.Emph({pandoc.Str(full_caption)})})
  local img_para = pandoc.Para({img})

  local figure_div = pandoc.Div(
    {img_para, caption_para},
    pandoc.Attr("fig-" .. fig_id, {"figure", "course-figure"})
  )

  return figure_div
end

-- {{< img id >}} - renders image from registry WITHOUT caption (for slides)
-- Same registry lookup as fig, but returns bare image element
function img(args, kwargs)
  local fig_id = args[1]
  if not fig_id then
    return pandoc.Strong({pandoc.Str("[ERROR: img shortcode requires figure ID]")})
  end

  local registry = get_figure_registry()
  local fig_data = registry[fig_id]

  if not fig_data then
    return pandoc.Strong({pandoc.Str("[ERROR: Image '" .. fig_id .. "' not found in registry]")})
  end

  -- Get figure properties
  local path = fig_data.path or ""
  local alt = fig_data.alt or fig_data.caption or ""

  -- Return just the image element (no figure wrapper, no caption)
  return pandoc.Image({pandoc.Str(alt)}, path)
end

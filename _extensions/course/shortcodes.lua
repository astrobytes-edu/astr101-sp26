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

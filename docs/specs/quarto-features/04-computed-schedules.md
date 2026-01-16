# Computed Schedules

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Why This Matters

Hardcoding lecture dates is a maintenance disaster:

```markdown
| Week | Date      | Topic              |
|------|-----------|--------------------|
| 1    | Jan 20    | Course Overview    |
| 1    | Jan 22    | Scaling & Units    |
| 2    | Jan 27    | Kepler's Laws      |
| 2    | Jan 29    | Newton & Gravity   |
```

**The problems:**

1. **Next semester, every date is wrong.** Spring 2027 starts on a different day. You manually recalculate 30+ lecture dates.

2. **Breaks are different.** Spring Break might be Week 10 this year, Week 11 next year. You shift everything.

3. **Human error.** You miscount, skip a Thursday, or forget the Monday holiday. Students show up to empty classrooms.

4. **It takes hours.** Time you could spend on content.

**Computed schedules solve this:**

- Store `semester_start: 2026-01-20` in one place
- Define lecture topics in order (no dates)
- Python script computes all dates automatically, skipping breaks
- Next semester: change one date, re-render, done

---

## How Computed Schedules Work Mechanically

The system has three components:

```
┌─────────────────────────────────────────────────────────────┐
│                   data/schedule.yml                         │
│                                                             │
│  semester_start: 2026-01-20                                │
│  days: [Tue, Thu]                                          │
│  breaks:                                                   │
│    - date: 2026-03-16                                      │
│      name: "Spring Break"                                  │
│      duration: 5                                           │
│  modules:                                                  │
│    - name: "Foundations"                                   │
│      lectures:                                             │
│        - title: "Course Overview"                          │
│        - title: "Scaling & Units"                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Python reads YAML
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              scripts/schedule_generator.py                  │
│                                                             │
│  1. Parse semester_start → datetime                        │
│  2. Generate all Tue/Thu dates for semester                │
│  3. Mark break dates as "no class"                         │
│  4. Assign lectures to non-break dates in order            │
│  5. Return formatted Markdown table                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Quarto runs Python
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 course-info/schedule.qmd                    │
│                                                             │
│  ```{python}                                                │
│  from scripts.schedule_generator import generate_schedule  │
│  print(format_schedule_table(schedule))                    │
│  ```                                                        │
│                                                             │
│  Renders as:                                               │
│  | Tue Jan 20 | Course Overview | Syllabus |               │
│  | Thu Jan 22 | Scaling & Units | Ch. 1    |               │
│  | ...        | ...             | ...      |               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## The Data File: `data/schedule.yml`

This is your single source of truth for the schedule:

```yaml
# data/schedule.yml
# ═══════════════════════════════════════════════════════════════
# SEMESTER CONFIGURATION
# Change these values to shift all dates automatically
# ═══════════════════════════════════════════════════════════════

# First day of classes (YYYY-MM-DD format)
# All lecture dates are computed from this
semester_start: 2026-01-20

# How many lectures per week and which days
lectures_per_week: 2
days: [Tue, Thu]  # Must match your actual meeting pattern

# ═══════════════════════════════════════════════════════════════
# BREAKS AND HOLIDAYS
# Dates when class does NOT meet
# ═══════════════════════════════════════════════════════════════

breaks:
  # Spring Break: entire week
  - date: 2026-03-16        # Monday of spring break week
    name: "Spring Break"
    duration: 5             # Mon-Fri = 5 calendar days

  # Single-day holidays
  - date: 2026-01-20        # MLK Day (if applicable)
    name: "MLK Day"
    duration: 1

  - date: 2026-03-31
    name: "Cesar Chavez Day"
    duration: 1

# ═══════════════════════════════════════════════════════════════
# COURSE CONTENT
# Lectures are assigned to dates IN ORDER
# No dates here - the script computes them
# ═══════════════════════════════════════════════════════════════

modules:
  # ─────────────────────────────────────────────────────────────
  - name: "Module 1: Foundations"
    weeks: [1, 2, 3]        # For reference only
    lectures:
      - title: "Course Overview"
        reading: "Syllabus"
        description: "What we'll learn and how we know it"

      - title: "Scaling & Units"
        reading: "Ch. 1, pp. 3-7"
        description: "Dimensional analysis as superpower"

      - title: "Kepler's Laws"
        reading: "Ch. 7, pp. 43-46"
        description: "Empirical laws of planetary motion"

      - title: "Newton & Gravity"
        reading: "Ch. 7, pp. 43-46"
        description: "From Kepler to physical understanding"

      - title: "Light as Information"
        reading: "Ch. 4.1-4.3, pp. 25-27"
        description: "What photons tell us about stars"

      - title: "Blackbody Radiation"
        reading: "Ch. 4.1-4.3, pp. 25-27"
        description: "Temperature from color"

  # ─────────────────────────────────────────────────────────────
  - name: "Module 2: Inferring Star Properties"
    weeks: [4, 5, 6, 7]
    lectures:
      - title: "Distance & Parallax"
        reading: "Ch. 2, pp. 11-16"

      - title: "Luminosity & Flux"
        reading: "Ch. 3, pp. 19-21"

      # ... more lectures

# ═══════════════════════════════════════════════════════════════
# ASSIGNMENTS
# Homework and exams with their weeks
# ═══════════════════════════════════════════════════════════════

homework:
  - week: 2
    title: "HW 1: Scaling & Units"
    due_day: Fri  # Due Friday of that week

  - week: 4
    title: "HW 2: Gravity & Orbits"
    due_day: Fri

exams:
  - week: 7
    title: "Exam 1"
    day: Thu      # Which day of the week
    duration: 75  # Minutes

  - week: 12
    title: "Exam 2"
    day: Thu
    duration: 75
```

---

## The Generator Script: `scripts/schedule_generator.py`

```python
#!/usr/bin/env python3
"""
schedule_generator.py
Generate lecture schedule from YAML data.

The key insight: lecture topics are ORDERED but UNDATED in the YAML.
This script assigns dates by:
1. Starting from semester_start
2. Generating all lecture-day dates (e.g., all Tuesdays and Thursdays)
3. Skipping dates that fall within break periods
4. Assigning lectures to remaining dates in order

Change semester_start in schedule.yml -> all dates shift automatically.
"""

import yaml
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Tuple, Any


def load_schedule_data(yaml_path: str = 'data/schedule.yml') -> Dict:
    """
    Load schedule configuration from YAML file.

    Args:
        yaml_path: Path to the YAML file (relative to project root)

    Returns:
        Dictionary containing all schedule configuration
    """
    with open(yaml_path, 'r') as f:
        return yaml.safe_load(f)


def get_lecture_dates(data: Dict) -> List[Tuple[datetime, bool, str]]:
    """
    Compute all potential lecture dates for the semester.

    This is the heart of the algorithm:
    1. Start from semester_start
    2. Generate dates for ~17 weeks
    3. Keep only dates that fall on lecture days (e.g., Tue/Thu)
    4. Mark which dates are breaks

    Args:
        data: Schedule configuration dictionary

    Returns:
        List of tuples: (date, is_break, break_name)
        - date: datetime object
        - is_break: True if this date is during a break
        - break_name: Name of the break (or None)
    """
    # Parse semester start date
    start = datetime.strptime(data['semester_start'], '%Y-%m-%d')

    # Map day names to weekday numbers (Monday=0, Tuesday=1, etc.)
    days_map = {
        'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3,
        'Fri': 4, 'Sat': 5, 'Sun': 6
    }
    lecture_days = [days_map[d] for d in data['days']]

    # Build dictionary of break dates
    # Key: date, Value: break name
    break_dates = {}
    for brk in data.get('breaks', []):
        brk_start = datetime.strptime(brk['date'], '%Y-%m-%d')
        for i in range(brk['duration']):
            break_dates[brk_start + timedelta(days=i)] = brk['name']

    # Generate all dates for the semester (~17 weeks)
    dates = []
    current = start
    end = start + timedelta(weeks=17)

    while current < end:
        # Check if this is a lecture day (e.g., Tuesday or Thursday)
        if current.weekday() in lecture_days:
            if current in break_dates:
                # This is a break day - mark it but include it
                dates.append((current, True, break_dates[current]))
            else:
                # Regular lecture day
                dates.append((current, False, None))
        current += timedelta(days=1)

    return dates


def generate_schedule(
    yaml_path: str = 'data/schedule.yml'
) -> Tuple[List[Dict], List[Dict]]:
    """
    Generate complete schedule with dates assigned to lectures.

    Algorithm:
    1. Get all potential lecture dates
    2. Iterate through modules and lectures (in order)
    3. For each lecture, assign the next non-break date
    4. Insert break markers where they occur

    Args:
        yaml_path: Path to schedule YAML file

    Returns:
        Tuple of (lecture_schedule, homework_schedule)
        Each is a list of dictionaries with date, title, reading, etc.
    """
    data = load_schedule_data(yaml_path)
    dates = get_lecture_dates(data)

    schedule = []
    hw_schedule = []
    date_idx = 0
    current_break = None

    # Process each module
    for module in data['modules']:
        for lecture in module['lectures']:
            # Skip past any break dates, adding markers for them
            while date_idx < len(dates) and dates[date_idx][1]:  # is_break
                date, _, break_name = dates[date_idx]

                # Only add break marker once per break period
                if break_name != current_break:
                    schedule.append({
                        'date': date,
                        'title': f"NO CLASS - {break_name}",
                        'reading': '',
                        'module': module['name'],
                        'is_break': True
                    })
                    current_break = break_name

                date_idx += 1

            # Reset break tracking when we exit a break
            if date_idx < len(dates) and not dates[date_idx][1]:
                current_break = None

            # Assign this lecture to the next available date
            if date_idx < len(dates):
                date, _, _ = dates[date_idx]
                schedule.append({
                    'date': date,
                    'title': lecture['title'],
                    'reading': lecture.get('reading', ''),
                    'description': lecture.get('description', ''),
                    'module': module['name'],
                    'is_break': False
                })
                date_idx += 1

    # Process homework schedule
    for hw in data.get('homework', []):
        hw_schedule.append({
            'week': hw['week'],
            'title': hw['title']
        })

    return schedule, hw_schedule


def format_schedule_table(schedule: List[Dict]) -> str:
    """
    Format schedule as Markdown table.

    Args:
        schedule: List of schedule entries from generate_schedule()

    Returns:
        Markdown-formatted table string
    """
    lines = [
        "| Date | Topic | Reading |",
        "|:-----|:------|:--------|"
    ]

    current_module = None

    for item in schedule:
        # Add module header when entering new module
        if item['module'] != current_module:
            current_module = item['module']
            lines.append(f"| | **{current_module}** | |")

        # Format the date
        date_str = item['date'].strftime('%a %b %d')  # "Tue Jan 20"

        # Format differently for breaks vs lectures
        if item['is_break']:
            lines.append(f"| {date_str} | *{item['title']}* | |")
        else:
            lines.append(
                f"| {date_str} | {item['title']} | {item['reading']} |"
            )

    return '\n'.join(lines)


# ═══════════════════════════════════════════════════════════════
# Command-line interface for testing
# ═══════════════════════════════════════════════════════════════

if __name__ == '__main__':
    schedule, hw = generate_schedule()
    print(format_schedule_table(schedule))
    print("\n\nHomework Schedule:")
    for hw_item in hw:
        print(f"  Week {hw_item['week']}: {hw_item['title']}")
```

---

## Using in Your Quarto Document

In `course-info/schedule.qmd`:

````markdown
---
title: "Course Schedule"
---

## How to Read This Schedule

This schedule is **automatically generated** from course data.
All dates are computed from the semester start date.

## Lecture Schedule

```{python}
#| echo: false
#| output: asis

# Add project root to path so we can import our script
import sys
sys.path.insert(0, '..')

from scripts.schedule_generator import generate_schedule, format_schedule_table

# Generate schedule from YAML data
schedule, _ = generate_schedule('../data/schedule.yml')

# Output as Markdown (the 'asis' option renders it as Markdown)
print(format_schedule_table(schedule))
```

## Important Dates

```{python}
#| echo: false
#| output: asis

# You can also generate other views of the data
import yaml

with open('../data/schedule.yml', 'r') as f:
    data = yaml.safe_load(f)

print(f"- **First day of class:** {data['semester_start']}")
print(f"- **Class days:** {', '.join(data['days'])}")

for exam in data.get('exams', []):
    print(f"- **{exam['title']}:** Week {exam['week']}, {exam['day']}")
```
````

---

## Updating for Next Semester

The whole point is making semester transitions trivial:

1. **Open `data/schedule.yml`**

2. **Update semester_start:**
   ```yaml
   semester_start: 2027-01-18  # New semester start
   ```

3. **Update breaks:**
   ```yaml
   breaks:
     - date: 2027-03-15
       name: "Spring Break"
       duration: 5
   ```

4. **Run `quarto render`**

5. **Done.** All 30+ lecture dates are correct.

The lecture order, topics, and readings stay exactly the same—only the dates shift to match the new semester's calendar.

---

## Common Pitfalls

### 1. Date format must be YYYY-MM-DD

```yaml
# WRONG
semester_start: 01-20-2026
semester_start: January 20, 2026

# CORRECT
semester_start: 2026-01-20
```

### 2. Day names must match exactly

```yaml
# WRONG
days: [Tuesday, Thursday]
days: [T, Th]

# CORRECT
days: [Tue, Thu]
```

### 3. Break duration is calendar days, not class days

```yaml
# Spring Break: Mon-Fri = 5 calendar days
- date: 2026-03-16  # Monday
  duration: 5       # Covers Mon, Tue, Wed, Thu, Fri
```

### 4. Python path issues

If you get import errors, make sure the Python code block adds the project root to the path:

```python
import sys
sys.path.insert(0, '..')  # Go up from course-info/ to project root
```

---

## Next Steps

- [Global Variables](01-global-variables.md) — More single-source-of-truth patterns
- [Profiles](05-profiles.md) — Student vs instructor views

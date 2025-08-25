Unified Templates (landmark-style)

- All pages now extend `base.html`.
- The global Top Bar and Sidebar live in `base.html` and are automatically included on every page.
- Per-page HTML files only put unique content inside `{% block content %}`. 
- Page-specific CSS can be added in `{% block extra_css %}`, and JS in `{% block extra_js %}`.

How to use in Flask/Jinja:
1) Place files in your `templates/` directory, preserving subfolders.
2) Ensure your base CSS/JS are available under `static/css/base.css` and `static/js/base.js`.
3) In your Flask routes, render templates as usual: `return render_template("album.html")` etc.
4) The login/signup pages use the same base but are tagged with an `auth` class on `<body>` via `request.endpoint` logic in `base.html` (already in your base).

Notes:
- The converter removed duplicated sections that matched `.top-bar`, `header`, `.sidebar`, and `#sidebarOverlay`. If any page had custom markup with those class names for non-nav purposes, you may need to restore them manually.
- If a page had inline scripts that controlled header/sidebar, those were removed; keep per-page scripts in `extra_js`.

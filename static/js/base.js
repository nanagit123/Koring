(function () {
  function qs(sel) { return document.querySelector(sel); }
  const sidebar = qs('#globalSidebar');
  const overlay = qs('#sidebarOverlay');
  const toggle = qs('#sidebarToggle');
  const closeBtn = qs('#sidebarClose');

  if (!sidebar || !overlay || !toggle || !closeBtn) return;

  function openSidebar() {
    sidebar.hidden = false;
    overlay.hidden = false;
    // allow transition
    requestAnimationFrame(() => {
      sidebar.classList.add('open');
      document.body.classList.add('sidebar-open');
      toggle.setAttribute('aria-expanded', 'true');
    });
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open');
    toggle.setAttribute('aria-expanded', 'false');
    // wait for transition to end, then hide
    setTimeout(() => {
      sidebar.hidden = true;
      overlay.hidden = true;
    }, 240);
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    if (expanded) closeSidebar(); else openSidebar();
  });

  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
  });

  // Close when navigating via links inside the sidebar
  sidebar.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href')) closeSidebar();
  });
})();

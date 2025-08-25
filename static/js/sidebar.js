// sidebar.js

const sidebar = document.getElementById('globalSidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('sidebarToggle');
const closeBtn = document.getElementById('sidebarClose');

// 사이드바 토글 함수
function toggleSidebar() {
  sidebar.classList.toggle('open');
  overlay.hidden = !overlay.hidden;

  // body 스크롤 잠금
  document.body.classList.toggle('sidebar-open', sidebar.classList.contains('open'));
}

// 메뉴 버튼 클릭
menuBtn.addEventListener('click', toggleSidebar);

// 닫기 버튼 클릭
closeBtn.addEventListener('click', toggleSidebar);

// 오버레이 클릭
overlay.addEventListener('click', toggleSidebar);

// ESC 키 누르면 닫기
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && sidebar.classList.contains('open')) {
    toggleSidebar();
  }
});

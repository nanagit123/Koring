// sidebar.js

// 사이드바 토글 함수
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('hidden')) {
    sidebar.classList.remove('hidden'); // 보이게
  } else {
    sidebar.classList.add('hidden'); // 숨기기
  }
}

// ESC 키 누르면 사이드바 닫기
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('hidden');
  }
});
// 사이드바가 아닌 화면 클릭시 사이드바 닫기
document.addEventListener('click', function (e) {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.querySelector('.menu-btn');
  const isClickInsideSidebar = sidebar.contains(e.target);
  const isClickOnMenu = menuBtn.contains(e.target);

  if (!isClickInsideSidebar && !isClickOnMenu && !sidebar.classList.contains('hidden')) {
    sidebar.classList.add('hidden');
  }
});

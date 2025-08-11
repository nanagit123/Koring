;
/**
 * 사이드바 토글 기능
 * 사이드바를 표시하거나 숨기는 함수
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('hidden')) {
    sidebar.classList.remove('hidden');
  } else {
    sidebar.classList.add('hidden');
  }
}

// ESC 키 누르면 사이드바 닫기
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('hidden');
  }
});

/**
 * 사이드바 외부 영역 클릭 시 사이드바 닫기
 * 필터 버튼과 제출 버튼 클릭 시에는 사이드바가 닫히지 않도록 예외 처리
 */
document.addEventListener('click', function (e) {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.querySelector('.menu-btn');

  // 필터 버튼이나 제출 버튼 클릭 시 사이드바 닫기 무시
  const isFilterBtnClick = e.target.closest('.filter-btn');
  const isSubmitBtnClick = e.target.closest('.submit-btn');
  
  if (isFilterBtnClick || isSubmitBtnClick) { 
    return; 
  }
  
  // 사이드바 내부 또는 메뉴 버튼 클릭 시 사이드바 유지
  const isClickInsideSidebar = sidebar.contains(e.target);
  const isClickOnMenu = menuBtn.contains(e.target);

  if (!isClickInsideSidebar && !isClickOnMenu && !sidebar.classList.contains('hidden')) {
    sidebar.classList.add('hidden');
  }
});
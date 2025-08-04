// sidebar.js

// 사이드바 토글 함수 (기존과 동일)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('hidden')) {
    sidebar.classList.remove('hidden'); // 보이게
  } else {
    sidebar.classList.add('hidden'); // 숨기기
  }
}

// ESC 키 누르면 사이드바 닫기 (기존과 동일)
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.add('hidden');
  }
});

// 사이드바가 아닌 화면 클릭시 사이드바 닫기 (수정 부분)
document.addEventListener('click', function (e) {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.querySelector('.menu-btn'); // 사이드바 여는 버튼 (햄버거 버튼 등)

  // 핵심 수정 부분: 특정 버튼 클릭시 사이드바 닫힘을 무시
  // 클릭된 요소가 filter-btn 클래스를 가진 요소거나 그 자식 요소이면 필터 버튼을 클릭한 것으로 간주
  const isFilterBtnClick = e.target.closest('.filter-btn');
  // 클릭된 요소가 submit-btn 클래스를 가진 요소거나 그 자식 요소이면 추천 버튼을 클릭한 것으로 간주
  const isSubmitBtnClick = e.target.closest('.submit-btn');

  // 만약 클릭된 요소가 필터 버튼이나 제출 버튼이라면, 사이드바를 닫지 않고 함수 종료
  // 이렇게 하면 해당 버튼들의 클릭 이벤트는 사이드바 닫기 로직에 영향을 주지 않아요.
  if (isFilterBtnClick || isSubmitBtnClick) { 
    return; 
  }
  
  // 사이드바 내부를 클릭했거나 메뉴 버튼을 클릭했다면 사이드바를 닫지 않음
  const isClickInsideSidebar = sidebar.contains(e.target);
  const isClickOnMenu = menuBtn.contains(e.target);

  if (!isClickInsideSidebar && !isClickOnMenu && !sidebar.classList.contains('hidden')) {
    sidebar.classList.add('hidden');
  }
});
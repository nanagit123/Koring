// 언어선택 드롭다운 리스트
function setupLanguageSelector() {
  const langSelect = document.querySelector('.lang-select select');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      changeLanguage(this.value);
    });
  }
}

/**언어변경함수
@param {string} lang 
*/
 
function changeLanguage(lang) {
  console.log(`언어가 ${lang}로 변경되었습니다.`);
}

document.addEventListener('DOMContentLoaded', function() {
  // 모든 필터 버튼과 추천 버튼 요소 가져오기
  const filterButtons = document.querySelectorAll('.filter-btn');
  const submitBtnContainer = document.querySelector('.submit-btn'); // div 요소를 찾음
  const submitBtn = submitBtnContainer ? submitBtnContainer.querySelector('button') : null; // div 안의 실제 버튼을 찾음

  if (!submitBtn) { // 버튼이 없으면 아무것도 안 함
    console.error("추천 버튼을 찾을 수 없습니다.");
    return;
  }

  // 각 필터 버튼에 클릭 이벤트 추가
  filterButtons.forEach(button => {
    button.onclick = function(e) {  // addEventListener 대신 onclick 속성 사용
      console.log('버튼 클릭됨! - onclick 방식');
      console.log('클릭 전 클래스:', this.className);
      e.preventDefault();  // 기본 동작 방지
      e.stopPropagation(); // 버블링 방지
      this.classList.toggle('selected');
      console.log('클릭 후 클래스:', this.className);
      updateSubmitButton();
      return false;  // 이벤트 전파 중지 (추가 안전장치)
    };
  });

  // 추천 버튼 클릭 이벤트
  submitBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const selectedTags = {};
    document.querySelectorAll('.filter-btn.selected').forEach(btn => {
      const category = btn.getAttribute('data-category');
      const value = btn.textContent;
      if (!selectedTags[category]) {
        selectedTags[category] = [];
      }
      selectedTags[category].push(value);
    });
        
    console.log('선택된 태그:', selectedTags);
    window.location.href = ''; // 여기에 실제 이동할 페이지 경로 넣기
  });

  // 추천 버튼 상태 업데이트 함수
  function updateSubmitButton() {
    const hasSelection = document.querySelectorAll('.filter-btn.selected').length > 0;
    
    if (hasSelection) {
      submitBtnContainer.classList.add('enabled'); // div에 'enabled' 클래스 추가 (CSS 위함)
      submitBtn.disabled = false; // 실제 버튼 활성화
      submitBtn.style.cursor = 'pointer'; // 버튼 커서 변경 (CSS로도 가능)
    } else {
      submitBtnContainer.classList.remove('enabled'); // div에서 'enabled' 클래스 제거
      submitBtn.disabled = true; // 실제 버튼 비활성화
      submitBtn.style.cursor = 'not-allowed'; // 버튼 커서 변경 (CSS로도 가능)
    }
  }
  
  // 초기 버튼 상태 설정
  updateSubmitButton();
});
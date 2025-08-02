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
  const submitBtn = document.querySelector('.submit-btn');

  // 각 필터 버튼에 클릭 이벤트 추가
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 버튼 선택 토글 (보라색으로 변경)
      this.classList.toggle('selected');
      
      // 카테고리별로 선택 관리 (옵션: 각 카테고리당 하나만 선택하게 하려면)
      // const category = this.getAttribute('data-category');
      // document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(btn => {
      //   if (btn !== this) btn.classList.remove('selected');
      // });
      
      // 추천 버튼 활성화 상태 업데이트
      updateSubmitButton();
    });
  });

  // 추천 버튼 클릭 이벤트
  submitBtn.addEventListener('click', function() {
    if (this.classList.contains('enabled')) {
      // 선택된 모든 태그 수집
      const selectedTags = {};
      
      document.querySelectorAll('.filter-btn.selected').forEach(btn => {
        const category = btn.getAttribute('data-category');
        const value = btn.textContent;
        
        if (!selectedTags[category]) {
          selectedTags[category] = [];
        }
        
        selectedTags[category].push(value);
      });
      
      // 여기서 백엔드로 데이터 전송 (예: fetch API 사용)
      console.log('선택된 태그:', selectedTags);
      
      // 백엔드 API 호출 예시
      // fetch('/api/recommend', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(selectedTags)
      // })
      // .then(response => response.json())
      // .then(data => {
      //   // 추천 결과 처리
      //   console.log('추천 결과:', data);
      // })
      // .catch(error => {
      //   console.error('추천 요청 실패:', error);
      // });
    }
  });

  // 추천 버튼 상태 업데이트 함수
  function updateSubmitButton() {
    // 선택된 버튼이 하나라도 있는지 확인
    const hasSelection = document.querySelectorAll('.filter-btn.selected').length > 0;
    
    if (hasSelection) {
      submitBtn.classList.add('enabled');
    } else {
      submitBtn.classList.remove('enabled');
    }
  }
  
  // 초기 버튼 상태 설정
  updateSubmitButton();
});
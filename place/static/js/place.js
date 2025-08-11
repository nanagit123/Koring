import { recommend } from './api.js';

/**
 * 언어 선택 드롭다운 설정 함수
 */
function setupLanguageSelector() {
  const langSelect = document.querySelector('.lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      changeLanguage(this.value);
    });
  }
}

/**
 * 언어 변경 처리 함수
 * @param {string} lang - 선택된 언어 코드
 */
function changeLanguage(lang) {
  console.log(`언어가 ${lang}로 변경되었습니다.`);
  // 실제 언어 변경 로직은 백엔드 연동 시 구현 필요
}

/**
 * 필터 기능 초기화 및 이벤트 처리
 */
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const submitBtnContainer = document.querySelector('.submit-btn');
  const submitBtn = submitBtnContainer ? submitBtnContainer.querySelector('button') : null;

  if (!submitBtn) {
    console.error("추천 버튼을 찾을 수 없습니다.");
    return;
  }

  // 필터 버튼 클릭 이벤트 설정
  filterButtons.forEach(button => {
    button.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle('selected');
      updateSubmitButton();
      return false;
    };
  });

  // 추천 버튼 클릭 이벤트
   submitBtn.addEventListener('click', async function(e) {
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
  
  try {
    const result = await recommend(selectedTags);
    console.log('추천 결과:', result);

    if (result && result.id) {
      window.location.href = `/restaurant.html?id=${result.id}`;
    } else {
      alert('추천 결과가 없습니다.');
    }
  } catch (err) {
    console.error('추천 요청 실패:', err);
    alert('추천 요청 중 오류가 발생했습니다.');
  }
});
    
  /**
   * 필터 선택 상태에 따라 추천 버튼 활성화/비활성화
   */
  function updateSubmitButton() {
    const hasSelection = document.querySelectorAll('.filter-btn.selected').length > 0;
    
    if (hasSelection) {
      submitBtnContainer.classList.add('enabled');
      submitBtn.disabled = false;
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtnContainer.classList.remove('enabled');
      submitBtn.disabled = true;
      submitBtn.style.cursor = 'not-allowed';
    }
  }
  
  // 초기 버튼 상태 설정
  updateSubmitButton();
});
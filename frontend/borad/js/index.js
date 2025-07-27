
// 전역 변수 선언
let posts = []; // 게시글 데이터를 저장할 배열

/**
 * 사이드바 토글 기능
 * 사이드바를 보이거나 숨기는 기능을 구현
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('hidden');
}

/**
 * 페이지 로드 시 실행되는 초기화 함수
 * 게시글 데이터를 가져와서 화면에 표시
 */
function initPage() {
  // 서버에서 게시글 데이터를 가져오는 함수 (실제로는 API 호출)
  fetchPosts();
  
  // 사이드바 토글 버튼 추가 (모바일 환경을 위해)
  addSidebarToggleButton();
  
  // 언어 선택 이벤트 리스너 추가
  setupLanguageSelector();
}

/**
 * 사이드바 토글 버튼을 동적으로 추가
 * 모바일 환경에서 사이드바를 열 수 있는 버튼 생성
 */
function addSidebarToggleButton() {
  const body = document.querySelector('body');
  const button = document.createElement('button');
  button.className = 'sidebar-toggle';
  button.innerHTML = '☰';
  button.onclick = toggleSidebar;
  body.insertBefore(button, body.firstChild);
}

/**
 * 언어 선택 기능 설정
 * 드롭다운에서 언어 선택 시 페이지 언어 변경
 */
function setupLanguageSelector() {
  const langSelect = document.querySelector('.lang-select select');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      changeLanguage(this.value);
    });
  }
}

/**
 * 언어 변경 함수
 * 선택된 언어에 따라 페이지 텍스트 변경
 * @param {string} lang - 선택된 언어 코드
 */
function changeLanguage(lang) {
  console.log(`언어가 ${lang}로 변경되었습니다.`);
  // 실제 구현에서는 여기에 다국어 처리 로직 추가
}

/**
 * 서버에서 게시글 데이터 가져오기
 * 실제 구현에서는 API 호출로 대체
 */
function fetchPosts() {
  // 임시 데이터 (실제로는 API에서 가져옴)
  posts = [
    {
      username: '여행자123',
      content: '오늘 경복궁 다녀왔어요! 정말 아름다웠습니다.',
      date: '2025-07-26'
    },
    {
      username: '서울탐험가',
      content: '남산타워에서 본 야경이 정말 환상적이었어요. 추천합니다!',
      date: '2025-07-27'
    },
    {
      username: '맛집탐방러',
      content: '북촌에서 찾은 숨은 맛집 공유합니다. 위치는 댓글에!',
      date: '2025-07-27'
    }
  ];
  
  // 가져온 데이터로 게시글 렌더링
  renderPosts();
}

/**
 * 게시글 렌더링 함수
 * posts 배열의 데이터를 사용하여 HTML 요소 생성
 */
function renderPosts() {
  const container = document.querySelector('.container');
  
  // 기존 내용 비우기
  container.innerHTML = '';
  
  // 각 게시글 렌더링
  posts.forEach(post => {
    const postElement = createPostElement(post);
    container.appendChild(postElement);
  });
}

/**
 * 게시글 요소 생성 함수
 * 게시글 데이터를 받아 HTML 요소로 변환
 * @param {Object} post - 게시글 데이터 객체
 * @return {HTMLElement} 생성된 게시글 요소
 */
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'preview-post';
  
  postDiv.innerHTML = `
    <div class="profile">
      <img src="../images/profile.jpg" alt="프로필" />
      <span class="post-user">${post.username}</span>
    </div>
    <a href="post.html?id=${Math.random().toString(36).substr(2, 9)}" class="post-link">
      <div class="post">
        <div class="meta">
          <p class="post-content">${post.content}</p>
          <span class="post-date">${post.date}</span>
        </div>
      </div>
    </a>
  `;
  
  return postDiv;
}

/**
 * 글쓰기 페이지로 이동
 */
function goToWritePage() {
  window.location.href = 'write.html';
}

// 페이지 로드 시 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initPage);
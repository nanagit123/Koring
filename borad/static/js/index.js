// 게시글 데이터를 저장 배열
let posts = []; 

//  사이드바 토글 기능
 
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('hidden');
}

// 게시글 데이터 표시
function initPage() {
  fetchPosts();
  // 사이드바 토글 버튼
  addSidebarToggleButton();
  // 언어 선택 이벤트 리스너
  setupLanguageSelector();
}

// 사이트바 토글 버튼.모바일
function addSidebarToggleButton() {
  const body = document.querySelector('body');
  const button = document.createElement('button');
  button.className = 'sidebar-toggle';
  button.innerHTML = '☰';
  button.onclick = toggleSidebar;
  body.insertBefore(button, body.firstChild);
}

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

// 게시글 데이터 가져오기
function fetchPosts() {
  fetch('/api/posts')
    .then(response => response.json())
    .then(data => {
      posts = data;  
      renderPosts();  
    })
    .catch(err => console.error('게시글 불러오기 실패', err));
}

// 게시글 렌더링 함수
function renderPosts() {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  posts.forEach(post => {
    const postElement = createPostElement(post);
    container.appendChild(postElement);
  });
}

/**
 * 게시글 생성 함수
 * @param {Object} post - 게시글 데이터 객체
 * @return {HTMLElement} 생성된 게시글 요소
 */
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'preview-post';
  
  postDiv.innerHTML = `
    <div class="profile">
      <img src="../images/profile.jpg" alt="John" /> 
      <span class="post-user">${post.username}</span>
    </div>
    <a href="index.html?id=${Math.random().toString(36).substr(2, 9)}" class="post-link">
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
  window.location.href = 'new.html';
}

// 페이지 로드 시 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initPage);
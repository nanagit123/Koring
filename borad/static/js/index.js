// 게시글 데이터를 저장할 배열
let posts = []; 

// 페이지 로드 시 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initPage); 

// 게시글 데이터 표시 및 이벤트 리스너 설정
function initPage() {
  fetchPosts();
  setupLanguageSelector();
}

// 언어선택 드롭다운 리스너 설정
function setupLanguageSelector() {
  const langSelect = document.querySelector('.language-select');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      changeLanguage(this.value);
    });
  }
}

/**
 * 언어변경 함수
 * @param {string} lang - 변경할 언어 코드
 */
function changeLanguage(lang) {
  console.log(`언어가 ${lang}로 변경되었습니다.`);
  // 추후 다국어 처리 로직 추가
}

/**
 * 게시글 데이터 가져오기
 */
async function fetchPosts() {
  try {
    const container = document.querySelector('.container');
    container.innerHTML = '<div class="loading">게시글을 불러오는 중...</div>';
    
    //백앤드 연결 전까지는 게시글 불러오기 실패 메세지 뜸
    const response = await fetch('/api/posts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    posts = await response.json();
    renderPosts();
  } catch (err) {
    console.error('게시글 불러오기 실패', err);
    document.querySelector('.container').innerHTML = 
      '<div class="error">게시글을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.</div>';
  }
}

/**
 * 게시글 렌더링 함수
 */
function renderPosts() {
  const container = document.querySelector('.container');
  const fragment = document.createDocumentFragment();

  if (posts.length === 0) {
    container.innerHTML = '<div class="no-posts">작성된 게시글이 없습니다.</div>';
    return;
  }

  posts.forEach(post => {
    const postElement = createPostElement(post);
    fragment.appendChild(postElement);
  });
  
  container.innerHTML = '';
  container.appendChild(fragment);
}

/**
 * 게시글 요소 생성 함수
 * @param {Object} post - 게시글 데이터 객체
 * @return {HTMLElement} 생성된 게시글 요소
 */
function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'preview-post';
  
  postDiv.innerHTML = `
    <div class="profile">
      <img src="../static/images/profile.jpg" alt="User" /> 
      <span class="post-user">${post.username || '익명 사용자'}</span>
    </div>
    <a href="post-detail.html?id=${post.id || generateUniqueId()}" class="post-link">
      <div class="post">
        <div class="meta">
          <p class="post-content">${post.content || '내용 없음'}</p>
          <span class="post-date">${post.date || new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </a>
  `;
  
  return postDiv;
}

/**
 * 고유 ID 생성 함수
 * @return {string} 생성된 고유 ID
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/**
 * 글쓰기 페이지로 이동
 */
function goToWritePage() {
  window.location.href = 'show.html';
}
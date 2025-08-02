// 전역 변수 선언
let currentPost = {}; // 현재 보고 있는 게시글 정보
let comments = [];    // 댓글 목록

/**
 * 페이지 로드 시 실행되는 초기화 함수
 * URL에서 게시글 ID 추출+ 데이터 가져옴
 */
function initPage() {
  // URL에서 게시글 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');
  
  if (postId) {
    // 게시글 데이터 가져오기
    fetchPostData(postId);
    // 댓글 데이터 가져오기
    fetchComments(postId);
  } else {
    // ID가 없으면 오류 메시지 표시
    showError('게시글을 찾을 수 없습니다.');
  }
  
  // 이벤트 리스너 등록
  setupEventListeners();
}

/**
 * 이벤트 리스너 설정 함수
 * 버튼 클릭 등의 사용자 상호작용 처리
 */
function setupEventListeners() {
  // 댓글 등록 버튼 클릭 이벤트
  const submitButton = document.querySelector('.submit-button');
  if (submitButton) {
    submitButton.addEventListener('click', submitComment);
  }
  
  // 문서 클릭 이벤트 (드롭다운 메뉴 닫기 위함)
  document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.post-dropdown-menu');
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target) && 
          !e.target.classList.contains('menu-icon')) {
        dropdown.style.display = 'none';
      }
    });
  });
}
//  * 메뉴 토글 함수 - 드롭다운 메뉴 표시/숨김
//  */
function toggleMenu(icon) {
  // 클릭된 아이콘 옆의 드롭다운 메뉴 찾기
  const dropdown = icon.nextElementSibling;
  
  // 모든 드롭다운 메뉴 닫기 (다른 메뉴가 열려있을 경우)
  const allDropdowns = document.querySelectorAll('.post-dropdown-menu');
  allDropdowns.forEach(menu => {
    if (menu !== dropdown) {
      menu.style.display = 'none';
    }
  });
  
  // 클릭된 메뉴의 드롭다운 토글
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
  }
}

/**
 * 게시글 데이터 가져오기
 * 백엔드 완성 후 연결하면 수정해야 함
 * @param {string} postId - 게시글 ID
 */
function fetchPostData(postId) {
  // 임시 데이터 (백엔드 연결 후 수정)
  currentPost = {
    id: postId,
    username: '여행자123',
    date: '2025-07-27',
    content: '오늘 경복궁 다녀왔어요! 정말 아름다웠습니다. 한복 입고 가니 무료입장이 가능해서 더 좋았어요. 날씨도 맑고 사진도 잘 나왔습니다. 다들 한번 방문해보세요~'
  };
  
  // 게시글 데이터 화면에 표시
  renderPostData();
}

/**
 * 댓글 데이터 가져오기
 * 백엔드 완성 후 연결하면 수정해야 함
 * @param {string} postId - 게시글 ID
 */
function fetchComments(postId) {
  // 임시 데이터 (백엔드 연결 후 수정)
  comments = [
    {
      id: '1',
      nickname: '서울탐험가',
      text: '저도 경복궁 정말 좋아해요! 특히 경회루가 아름답더라구요~'
    },
    {
      id: '2',
      nickname: '역사덕후',
      text: '한복 대여는 어디서 하셨나요? 저도 다음에 가보려고요!'
    },
    {
      id: '3',
      nickname: '사진작가',
      text: '사진 구경하고 싶네요! 혹시 앨범에 올려주실 수 있나요?'
    }
  ];
  
  // 댓글 데이터 화면에 표시
  renderComments();
}

/**
 * 게시글 데이터를 화면에 표시
 */
function renderPostData() {
  // 템플릿 변수 대체
  document.querySelector('.post-user').textContent = currentPost.username;
  document.querySelector('.post-date').textContent = currentPost.date;
  
  // 게시글 내용에서 템플릿 변수 대체
  const contentElement = document.querySelector('.post-content');
  if (contentElement) {
    // {{content}} 부분만 교체하기 위해 첫 번째 자식 노드만 수정
    const contentNodes = contentElement.childNodes;
    for (let i = 0; i < contentNodes.length; i++) {
      if (contentNodes[i].nodeType === Node.TEXT_NODE && 
          contentNodes[i].textContent.trim() === '{{content}}') {
        contentNodes[i].textContent = currentPost.content;
        break;
      }
    }
  }
}

/**
 * 댓글 목록을 화면에 표시
 */
function renderComments() {
  const commentsSection = document.querySelector('.comments');
  
  // 기존 내용 비우기
  commentsSection.innerHTML = '';
  
  // 댓글이 없는 경우
  if (comments.length === 0) {
    commentsSection.innerHTML = '<p class="no-comments">아직 댓글이 없습니다.</p>';
    return;
  }
  
  // 각 댓글 렌더링
  comments.forEach(comment => {
    const commentElement = createCommentElement(comment);
    commentsSection.appendChild(commentElement);
  });
}

/**
 * 댓글 요소 생성 함수
 * @param {Object} comment - 댓글 데이터 객체
 * @return {HTMLElement} 생성된 댓글 요소
 */
function createCommentElement(comment) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  
  commentDiv.innerHTML = `
    <div class="comment-profile">
      <img src="../images/profile.jpg" alt="댓글자 프로필" class="profile-img" />
    </div>
    <div class="comment-bubble">
      <div class="comment-user">${comment.nickname}</div>
      <div class="comment-text">${comment.text}</div>
    </div>
  `;
  
  return commentDiv;
}
/**
 * 댓글 등록 함수
 */
function submitComment() {
  const commentInput = document.getElementById('comment');
  const commentText = commentInput.value.trim();
  
  if (commentText === '') {
    alert('댓글 내용을 입력해주세요.');
  }
}
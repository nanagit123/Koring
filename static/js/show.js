// 전역 변수 선언
let currentPost = {}; // 현재 게시글 정보
let comments = [];    // 댓글 목록

// 페이지 초기화: URL에서 게시글 ID 추출 및 데이터 로드
function initPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id')|| 'default';
  
  if (postId) {
    fetchPostData(postId);
    fetchComments(postId);
  } else {
    showError('게시글을 찾을 수 없습니다.');
  }
  
  setupEventListeners();
}
// 오류 메시지 표시 함수
function showError(message) {
  const container = document.querySelector('.post-view-container');
  if (container) {
    container.innerHTML = `<div class="error-message" style="text-align: center; color: red; margin-top: 20px;">
                            ${message}
                            </div>`;
  } else {
    alert(message);
    console.error("오류 메시지 표시 컨테이너를 찾을 수 없습니다.");
  }
}

// 이벤트 리스너 설정
function setupEventListeners() {
  const submitButton = document.querySelector('.submit-button');
  if (submitButton) {
    submitButton.addEventListener('click', submitComment);
  }
  
  // 드롭다운 메뉴 외부 클릭 시 닫기
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

// 메뉴 토글 - 드롭다운 표시/숨김
function toggleMenu(icon) {
  const dropdown = icon.nextElementSibling;
  
  // 다른 열린 메뉴 닫기
  const allDropdowns = document.querySelectorAll('.post-dropdown-menu');
  allDropdowns.forEach(menu => {
    if (menu !== dropdown) {
      menu.style.display = 'none';
    }
  });
  
  // 현재 메뉴 토글
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// 게시글 데이터 로드 (백엔드 연결 전 임시 데이터)
function fetchPostData(postId) {
  currentPost = {
    id: postId,
    username: '여행자123',
    date: '2025-07-27',
    content: '오늘 경복궁 다녀왔어요! 정말 아름다웠습니다. 한복 입고 가니 무료입장이 가능해서 더 좋았어요. 날씨도 맑고 사진도 잘 나왔습니다. 다들 한번 방문해보세요~'
  };
  
  renderPostData();
}

// 댓글 데이터 로드 (백엔드 연결 전 임시 데이터)
function fetchComments(postId) {
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
  
  renderComments();
}

// 게시글 데이터 화면에 표시
function renderPostData() {
  // 1. 사용자 이름 표시
  const postUserElement = document.querySelector('.post-user');
  if (postUserElement) { 
    postUserElement.textContent = currentPost.username;
  }
  
  // 2. 날짜 표시
  const postDateElement = document.querySelector('.post-date');
  if (postDateElement) {
    postDateElement.textContent = currentPost.date;
  }
  
  // 3. 게시글 내용 표시
  const contentElement = document.querySelector('.post-content');
  if (contentElement) {
    contentElement.textContent = currentPost.content; 
  }
}


// 댓글 목록 화면에 표시
function renderComments() {
  const commentsSection = document.querySelector('.comments');
  commentsSection.innerHTML = '';
  
  if (comments.length === 0) {
    commentsSection.innerHTML = '<p class="no-comments">아직 댓글이 없습니다.</p>';
    return;
  }
  
  comments.forEach(comment => {
    commentsSection.appendChild(createCommentElement(comment));
  });
}

// 댓글 요소 생성
function createCommentElement(comment) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  
  commentDiv.innerHTML = `
    <div class="comment-profile">
      <img src="../static/images/profile.jpg" alt="프로필" class="profile-img" />
    </div>
    <div class="comment-bubble">
      <div class="comment-user">${comment.nickname}</div>
      <div class="comment-text">${comment.text}</div>
    </div>
  `;
  
  return commentDiv;
}

// 댓글 등록
function submitComment() {
  const commentInput = document.getElementById('comment');
  const commentText = commentInput.value.trim();
  
  if (commentText === '') {
    alert('댓글 내용을 입력해주세요.');
    return;
  }
  const newComment = {
    id: Date.now().toString(),
    nickname: '나',
    text: commentText
  };
  
  comments.push(newComment);
  renderComments();
  commentInput.value = '';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initPage);
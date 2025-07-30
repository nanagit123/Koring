/**
 * write.js - 글쓰기 페이지 기능 구현
 * 작성자: 나윤서
 * 최종 수정일: 2025-07-27
 */

// 전역 변수 선언
let uploadedImages = []; // 업로드된 이미지 파일들을 저장할 배열

/**
 * 페이지 로드 시 실행되는 초기화 함수
 */
function initPage() {
  // 이미지 업로드 이벤트 리스너 등록
  setupImageUpload();
  
  // 완료 버튼 이벤트 리스너 등록
  setupSubmitButton();
  
  // 텍스트 영역 자동 높이 조절
  setupTextareaAutoResize();
}

/**
 * 이미지 업로드 기능 설정
 */
function setupImageUpload() {
  const imageUpload = document.getElementById('imageUpload');
  
  if (imageUpload) {
    imageUpload.addEventListener('change', function(e) {
      const files = e.target.files;
      
      if (files && files.length > 0) {
        // 파일 미리보기 및 저장
        handleImageUpload(files);
      }
    });
  }
}

/**
 * 이미지 파일 처리 함수
 */
function handleImageUpload(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      continue;
    }
    
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      continue;
    }
    
    // 이미지 미리보기 생성 및 표시
    createImagePreview(file);
    
    // 업로드된 이미지 배열에 추가
    uploadedImages.push(file);
  }
}

/**
 * 이미지 미리보기 생성 함수
 */
function createImagePreview(file) {
  const reader = new FileReader();
  
  reader.onload = function(e) {
    // 이미지 미리보기 컨테이너 생성
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-preview-container';
    
    // 이미지 요소 생성
    const img = document.createElement('img');
    img.src = e.target.result;
    img.className = 'image-preview';
    
    // 삭제 버튼 생성
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-image-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.onclick = function() {
      // 이미지 미리보기 삭제
      previewContainer.remove();
      
      // 업로드된 이미지 배열에서도 제거
      const index = uploadedImages.indexOf(file);
      if (index > -1) {
        uploadedImages.splice(index, 1);
      }
    };
    
    // 컨테이너에 이미지와 삭제 버튼 추가
    previewContainer.appendChild(img);
    previewContainer.appendChild(deleteBtn);
    
    // 미리보기 영역에 추가
    const contentEditor = document.querySelector('.content-editor');
    contentEditor.appendChild(previewContainer);
  };
  
  reader.readAsDataURL(file);
}

/**
 * 완료 버튼 설정
 */
function setupSubmitButton() {
  const submitButton = document.querySelector('.submit-button button');
  
  if (submitButton) {
    // 기존 onclick 속성 대신 이벤트 리스너 사용
    submitButton.removeAttribute('onclick');
    submitButton.addEventListener('click', submitPost);
  }
}

/**
 * 게시글 등록 함수
 */
function submitPost() {
  const textarea = document.querySelector('.post-textarea');
  const content = textarea.value.trim();
  
  // 내용이 비어있는지 확인
  if (content === '') {
    alert('내용을 입력해주세요.');
    return;
  }
  
  // 게시글 데이터 구성
  const postData = {
    content: content,
    images: uploadedImages,
    date: new Date().toISOString()
  };
  
  // 실제로는 여기서 백엔드 API로 데이터 전송
  console.log('게시글 데이터:', postData);
  
  // 성공 시 목록 페이지로 이동
  window.location.href = 'index.html';
}

/**
 * 텍스트 영역 자동 높이 조절 설정
 */
function setupTextareaAutoResize() {
  const textarea = document.querySelector('.post-textarea');
  
  if (textarea) {
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
  }
}

// 페이지 로드 시 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initPage);
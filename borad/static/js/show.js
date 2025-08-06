// 전역 변수: 업로드된 이미지 파일들을 저장
let uploadedImages = []; // File 객체 배열

/**
 * 페이지 로드 시 초기화 함수
 */
function initPage() {
  setupImageUpload();       // 이미지 업로드 기능 설정
  setupSubmitButton();      // 완료 버튼 이벤트 리스너 설정
  setupTextareaAutoResize(); // 텍스트 영역 자동 높이 조절 설정
}

/**
 * 이미지 업로드 기능 설정
 */
function setupImageUpload() {
  const imageUpload = document.getElementById('imageUpload');
  if (imageUpload) {
    imageUpload.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleImageUpload(e.target.files);
      }
    });
  }
}

/**
 * 이미지 파일 처리 및 유효성 검사
 * @param {FileList} files - 선택된 파일 목록
 */
function handleImageUpload(files) {
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      continue;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB 제한
      alert('파일 크기는 5MB 이하여야 합니다.');
      continue;
    }
    createImagePreview(file);
    uploadedImages.push(file);
  }
}

/**
 * 이미지 미리보기 생성 및 화면에 표시
 * @param {File} file - 미리보기를 생성할 파일
 */
function createImagePreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-preview-container';
    
    const img = document.createElement('img');
    img.src = e.target.result;
    img.className = 'image-preview';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-image-btn';
    deleteBtn.innerHTML = '✕';
    deleteBtn.onclick = () => {
      previewContainer.remove();
      const index = uploadedImages.indexOf(file);
      if (index > -1) {
        uploadedImages.splice(index, 1);
      }
    };
    
    previewContainer.appendChild(img);
    previewContainer.appendChild(deleteBtn);
    
    const contentEditor = document.querySelector('.content-editor');
    if (contentEditor) {
      contentEditor.appendChild(previewContainer);
    } else {
      console.error('.content-editor 요소를 찾을 수 없습니다.');
    }
  };
  reader.readAsDataURL(file);
}

/**
 * 완료 버튼 이벤트 리스너 설정
 */
function setupSubmitButton() {
  const submitButtonContainer = document.querySelector('.submit-button');
  if (submitButtonContainer) {
    const actualButton = submitButtonContainer.querySelector('button'); 
    if (actualButton) {
      actualButton.removeAttribute('onclick');
      actualButton.addEventListener('click', submitPost);
    }
  }
}

/**
 * 게시글 등록 및 백엔드 전송
 */
async function submitPost() {
  const textarea = document.querySelector('.post-textarea');
  const content = textarea ? textarea.value.trim() : '';
  
  if (content === '') {
    alert('내용을 입력해주세요.');
    return;
  }
  
  const formData = new FormData(); // FormData로 텍스트와 파일 함께 전송
  formData.append('content', content);
  formData.append('date', new Date().toISOString());

  uploadedImages.forEach((file) => {
    formData.append(`images`, file); // 'images' 필드에 각 File 객체 추가
  });
  
  try {
    // API 엔드포인트는 백엔드와 논의 후 확정
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData, // FormData는 multipart/form-data로 자동 전송
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 서버 오류' }));
      throw new Error(`게시글 등록 실패: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('게시글 등록 성공:', result);
    
    window.location.href = 'index.html'; // 성공 시 목록 페이지로 이동

  } catch (error) {
    console.error('게시글 등록 중 오류 발생:', error);
    alert('게시글 등록에 실패했습니다. 잠시 후 다시 시도해주세요. 오류: ' + error.message);
  }
}

/**
 * 텍스트 영역 자동 높이 조절
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
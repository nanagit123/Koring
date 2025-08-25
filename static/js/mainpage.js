import { getPosts } from './api.js';

function renderCommunityPreview(posts) {
  const listEl = document.getElementById('post-list'); 
  listEl.innerHTML = '';

  posts.forEach(post => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `/post/${post.id}`;
    link.textContent = post.title;
    li.appendChild(link);
    listEl.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getPosts()
    .then(data => { console.log('게시글 데이터:', data); renderCommunityPreview(data); })
    .catch(err => console.error('게시글 불러오기 실패', err));
});
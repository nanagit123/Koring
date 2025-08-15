const API_BASE = 'http://localhost:5000';

//로그인/회원가입

export function login(data) {
  return fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export function register(data) {
  return fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export function logout() {
  return fetch(`${API_BASE}/api/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
}

export function checkAuth() {
  return fetch(`${API_BASE}/api/check-auth`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
}

//레스토랑

export function recommend(data) {
  return fetch(`${API_BASE}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export function getRestaurant(id) {
  return fetch(`${API_BASE}/api/restaurant/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json());
}

//지도 (카카오 키 필요)

export function search(data) {
  return fetch(`${API_BASE}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export function searchAddress(data) {
  return fetch(`${API_BASE}/api/search-address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export function getMap(data) {
  return fetch(`${API_BASE}/api/get-map`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

// 메인페이지 api - 0815-나윤서 임의로 추가

// export function getPosts() {
//   return fetch(`${API_BASE}/api/posts`, {
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json' }
//   }).then(res => res.json());
// }

// api.js 임시 테스트용-0815 확인 완료
export function getPosts() {
  return Promise.resolve([
    { id: 1, title: "테스트 글 1" },
    { id: 2, title: "테스트 글 2" },
    { id: 3, title: "테스트 글 3" }
  ]);
}

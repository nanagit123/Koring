// URL 파라미터 읽기
const params = new URLSearchParams(window.location.search);
const foodType = params.get('food') || '맛집';

// 카카오맵 Places API
const ps = new kakao.maps.services.Places();

// 음식 종류로 검색
ps.keywordSearch(foodType, placesSearchCB);

function placesSearchCB(data, status) {
  if (status === kakao.maps.services.Status.OK) {
    renderPlaces(data);
  } else {
    document.getElementById('place-list').innerHTML = '<p>검색 결과가 없습니다.</p>';
  }
}

// 결과 렌더링
function renderPlaces(places) {
  const container = document.getElementById('place-list');
  container.innerHTML = '';

  places.forEach(place => {
    const item = document.createElement('div');
    item.className = 'place-item';

    // 이미지 없을 경우 기본 이미지
    const imgUrl = place.place_url.includes('place') 
      ? `https://via.placeholder.com/70?text=${encodeURIComponent(place.category_group_name || '맛집')}`
      : `https://via.placeholder.com/70?text=맛집`;

    item.innerHTML = `
      <img src="${imgUrl}" alt="${place.place_name}" class="place-img">
      <div class="place-info">
        <div class="place-name">${place.place_name}</div>
        <div class="place-address">${place.road_address_name || place.address_name}</div>
        <div class="place-phone">${place.phone || '전화번호 없음'}</div>
      </div>
    `;

    container.appendChild(item);
  });
}

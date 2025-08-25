//-- api 연결 코드 
// // URL 파라미터 읽기
// const params = new URLSearchParams(window.location.search);
// const foodType = params.get('food') || '맛집';

// // 카카오맵 Places API
// const ps = new kakao.maps.services.Places();

// // 음식 종류로 검색
// ps.keywordSearch(foodType, placesSearchCB);

// function placesSearchCB(data, status) {
//   if (status === kakao.maps.services.Status.OK) {
//     renderPlaces(data);
//   } else {
//     document.getElementById('place-list').innerHTML = '<p>검색 결과가 없습니다.</p>';
//   }
// }

// // 결과 렌더링
// function renderPlaces(places) {
//   const container = document.getElementById('place-list');
//   container.innerHTML = '';

//   places.forEach(place => {
//     const item = document.createElement('div');
//     item.className = 'place-item';

//     // 이미지 없을 경우 기본 이미지
//     const imgUrl = place.place_url.includes('place') 
//       ? `https://via.placeholder.com/70?text=${encodeURIComponent(place.category_group_name || '맛집')}`
//       : `https://via.placeholder.com/70?text=맛집`;

//     item.innerHTML = `
//       <img src="${imgUrl}" alt="${place.place_name}" class="place-img">
//       <div class="place-info">
//         <div class="place-name">${place.place_name}</div>
//         <div class="place-address">${place.road_address_name || place.address_name}</div>
//         <div class="place-phone">${place.phone || '전화번호 없음'}</div>
//       </div>
//     `;

//     container.appendChild(item);
//   });
// }

// --더미데이터 코드 --연결 확인 후 삭제
// URL 파라미터 읽기
const params = new URLSearchParams(window.location.search);
const foodType = params.get('food') || '맛집';

// 더미 데이터
const dummyPlaces = [
  {
    place_name: "맛집 A",
    category_group_name: "한식",
    road_address_name: "서울특별시 종로구 맛집로 1",
    address_name: "서울 종로구 1",
    phone: "02-123-4567",
    place_url: "#"
  },
  {
    place_name: "맛집 B",
    category_group_name: "일식",
    road_address_name: "서울특별시 강남구 맛집길 2",
    address_name: "서울 강남구 2",
    phone: "02-987-6543",
    place_url: "#"
  },
  {
    place_name: "카페 C",
    category_group_name: "카페",
    road_address_name: "서울특별시 마포구 카페로 3",
    address_name: "서울 마포구 3",
    phone: "",
    place_url: "#"
  }
];

// 결과 렌더링
function renderPlaces(places) {
  const container = document.getElementById('place-list');
  container.innerHTML = '';

  places.forEach(place => {
    const item = document.createElement('div');
    item.className = 'place-item';

    // 이미지 없을 경우 기본 이미지
   const imgUrl = `https://via.placeholder.com/70?text=${encodeURIComponent(place.category_group_name || '맛집')}`;

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

// 페이지 로딩 시 더미 데이터 렌더링
renderPlaces(dummyPlaces);
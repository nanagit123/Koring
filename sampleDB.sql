USE KoringDB;

-- tUser 샘플 데이터
INSERT INTO tUser (userLoginID, userPW, userName, userMail, userAgeGroup, userFoodPref, userNationality, userSessionToken) VALUES
('user1', 'pw1234', '홍길동', 'hong@example.com', '20s', '한식, 중식', '한국', 'token123'),
('user2', 'pw5678', 'Jamse', 'JJ@example.com', '30s', '양식, 일식', 'USA', 'token456');

-- tPost 샘플 데이터
INSERT INTO tPost (postTitle, postContent, postImageURL, postCreatedAt, userID) VALUES
('경복궁 후기', '웅장하고 이쁘다', 'http://example.com/image1.jpg', '2025-07-01 10:00:00', 1),
('맛집 추천', '여기 피자 정말 맛있어요.', 'http://example.com/image2.jpg', '2025-07-02 15:30:00', 2);

-- tComment 샘플 데이터
INSERT INTO tComment (commentContent, commentDate, postID, userID) VALUES
('야경 이쁘네요', '2025-07-03 09:00:00', 1, 2),
('사진 잘 찍으셨네요', '2025-07-03 12:00:00', 2, 1);

-- tSpot 샘플 데이터
INSERT INTO tSpot (spotName, spotInfo, spotAddress, spotKeyword) VALUES
('경복궁', '조선 왕조 제일의 법궁', '서울특별시 종로구 사직로', '궁,유적,산책'),
('남산타워', '서울의 대표적인 랜드마크', '서울특별시 용산구 남산', '타워,랜드마크,볼거리');

-- tVisit 샘플 데이터
INSERT INTO tVisit (visitDate, userID, spotID) VALUES
('2025-07-01 11:00:00', 1, 1),
('2025-07-02 16:00:00', 2, 2);

-- tRecommend 샘플 데이터
INSERT INTO tRecommend (spotID, userAgeGroup, userFoodPref, userNationality) VALUES
(1, '20s', '양식', '한국'),
(2, '30s', '한식', '한국');

-- tRestaurant 샘플 데이터
INSERT INTO tRestaurant (restaurantName, restaurantAddress, restaurantLatitude, restaurantLongitude, restaurantTags) VALUES
('남산돈까스', '서울특별시 용산구 남산 123', 37.55106, 126.99067, '돈까스,양식'),
('한식뷔페', '서울특별시 종로구 사직로 456', 37.57645, 126.97733, '피자,양식');

-- tTranslationLog 샘플 데이터
INSERT INTO tTranslationLog (tLogOriginalText, tLogTranslatedText, tLogSourceLang, tLogTargetLang, tLogTimestamp, userID) VALUES
('Hello', '안녕하세요', 'en', 'ko', '2025-07-04 10:00:00', 1),
('감사합니다', 'Thank you', 'ko', 'en', '2025-07-04 11:00:00', 2);

-- Photo 샘플 데이터
INSERT INTO Photo (photoImageUrl, photoTemplate, photoCreatedAt, photoSharedSNS, userID) VALUES
('http://example.com/photo1.jpg', 'N', '2025-07-05 14:00:00', 'Instagram', 1),
('http://example.com/photo2.jpg', 'Y', '2025-07-05 15:00:00', 'Instagram', 2);

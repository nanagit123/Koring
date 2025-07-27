CREATE DATABASE KoringDB; 
USE KoringDB;

CREATE TABLE tUser (
  userID INT AUTO_INCREMENT PRIMARY KEY,
  userLoginID VARCHAR(50) UNIQUE NOT NULL,
  userPW VARCHAR(100) NOT NULL,
  userName VARCHAR(50),
  userMail VARCHAR(100),
  userAgeGroup VARCHAR(20),
  userFoodPref VARCHAR(100),
  userNationality VARCHAR(50),
  userSessionToken VARCHAR(225)
);

CREATE TABLE tPost (
  postID INT AUTO_INCREMENT PRIMARY KEY,
  postTitle VARCHAR(100) NOT NULL,
  postContent TEXT,
  postImageURL VARCHAR(255),
  postCreatedAt DATETIME NOT NULL,
  userID INT NOT NULL
);

CREATE TABLE tComment (
  commentID INT AUTO_INCREMENT PRIMARY KEY,
  commentContent TEXT NOT NULL,
  commentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  postID INT NOT NULL,
  userID INT NOT NULL
);

CREATE TABLE tSpot (
  spotID INT AUTO_INCREMENT PRIMARY KEY,
  spotName VARCHAR(100) NOT NULL,
  spotInfo VARCHAR(255),
  spotAddress VARCHAR(100),
  spotKeyword VARCHAR(255)
);

CREATE TABLE tVisit (
  visitID INT AUTO_INCREMENT PRIMARY KEY,
  visitDate DATETIME NOT NULL,
  userID INT NOT NULL,
  spotID INT NOT NULL
);

CREATE TABLE tRecommend (
  recommendID INT AUTO_INCREMENT PRIMARY KEY,
  spotID INT,
  userAgeGroup VARCHAR(20),
  userFoodPref VARCHAR(100),
  userNationality VARCHAR(50)
);

CREATE TABLE tRestaurant (
  restaurantID INT AUTO_INCREMENT PRIMARY KEY,
  restaurantName VARCHAR(100) NOT NULL,
  restaurantAddress VARCHAR(100) NOT NULL,
  restaurantLatitude DECIMAL(10,6) NOT NULL,
  restaurantLongitude DECIMAL(10,6) NOT NULL,
  restaurantTags VARCHAR(100)
);

CREATE TABLE tTranslationLog (
  tLogID INT AUTO_INCREMENT PRIMARY KEY,
  tLogOriginalText TEXT NOT NULL,
  tLogTranslatedText TEXT NOT NULL,
  tLogSourceLang TEXT,
  tLogTargetLang TEXT NOT NULL,
  tLogTimestamp DATETIME,
  userID INT NOT NULL
);

CREATE TABLE Photo (
  photoID INT AUTO_INCREMENT PRIMARY KEY,
  photoImageUrl VARCHAR(255) NOT NULL,
  photoTemplate ENUM('Y', 'N'),
  photoCreatedAt DATETIME NOT NULL,
  photoSharedSNS VARCHAR(255),
  userID INT NOT NULL
);
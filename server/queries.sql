CREATE DATABASE Kite;
USE Kite;

CREATE TABLE UserAccounts(_id INT AUTO_INCREMENT PRIMARY KEY, _uname CHAR(255) UNIQUE, _email CHAR(255) UNiQUE, _pass CHAR(255));
SELECT * FROM UserAccounts;
DROP Table UserAccounts;

CREATE TABLE UserProfiles(_id INT, FOREIGN KEY(_id) REFERENCES UserAccounts(_id) ON DELETE CASCADE, _rname CHAR(255), _bio CHAR(255), _pfp CHAR(255));
DROP TABLE UserProfiles;
SELECT * FROM UserProfiles;

SELECT AC._uname, UP._rname, UP._pfp FROM UserProfiles as UP
INNER JOIN UserAccounts as AC
ON AC._id = UP._id
WHERE AC._uname LIKE "%pr%" OR UP._rname LIKE "%pr%";

CREATE TABLE FriendsRelationship(_follower INT, _follwing INT, UNIQUE(_follower, _following), FOREIGN KEY(_follower) REFERENCES UserAccounts(_id), FOREIGN KEY(_following) REFERENCES UserAccounts(_id));
SELECT * FROM FriendsRelationship ORDER BY _following;

INSERT INTO FriendsRelationship VALUES (1, (SELECT _id FROM UserAccounts WHERE _uname = 'pengi'));
DELETE FROM FriendsRelationship WHERE _follower = 1 AND _following = (SELECT _id FROM UserAccounts WHERE _uname = 'pengi');

-- Follower
SELECT UserProfiles._pfp, (SELECT _uname FROM UserAccounts WHERE _id = UserProfiles._id), UserProfiles._rname 
	FROM UserProfiles 
    INNER JOIN FriendsRelationship 
    ON UserProfiles._id = FriendsRelationship._follower 
	WHERE FriendsRelationship._following = (SElECT _id FROM UserAccounts WHERE _uname = 'pengi');

-- Following
SELECT UserProfiles._pfp, (SELECT _uname FROM UserAccounts WHERE _id = UserProfiles._id), UserProfiles._rname 
	FROM UserProfiles 
    INNER JOIN FriendsRelationship 
    ON UserProfiles._id = FriendsRelationship._following
	WHERE FriendsRelationship._follower = (SElECT _id FROM UserAccounts WHERE _uname = 'pengi');

-- Notifications
CREATE TABLE Notifications (_id INT, FOREIGN KEY(_id) REFERENCES UserAccounts(_id), _date DATE, _msg CHAR(255), _read BOOL);
DROP TABLE Notifications ;
SELECT CONCAT(_msg, DATEDIFF(_date, CURDATE()), " days ago"), _read FROM Notifications;
SELECT * FROM Notifications;
INSERT INTO Notifications VALUES (3, CURDATE(), "{data['_uname']} Started Following You. - ", FALSE);

-- Posts
CREATE TABLE Posts (_pid INT PRIMARY KEY AUTO_INCREMENT, _uid INT, FOREIGN KEY(_uid) REFERENCES UserAccounts(_id), _img CHAR(255), _text TExT);
DROP TABLE Posts;
select * from Posts ORDER BY RAND() ;
INSERT INTO Posts(_uid, _img, _text) VALUE (3, "", "acsdfsdgf");
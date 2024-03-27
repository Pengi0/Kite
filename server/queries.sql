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
ALTER TABLE Posts ADD _private INT DEFAULT 1;
DROP TABLE Posts;
SELECT * FROM Posts;
SELECT x.*, PostLikes._uid = 3 as liked, PostSaves._uid = 3 as saved FROM (SELECT Posts.*, UserAccounts._uname, UserProfiles._pfp from Posts
	INNER JOIN FriendsRelationship ON FriendsRelationship._following = Posts._uid
    INNER JOIN UserAccounts ON UserAccounts._id = Posts._uid
    INNER JOIN UserProfiles ON UserProfiles._id = Posts._uid
    WHERE FriendsRelationship._follower = 3
	UNION
	SELECT Posts.*, UserAccounts._uname, UserProfiles._pfp from Posts
    INNER JOIN UserAccounts ON UserAccounts._id = Posts._uid
    INNER JOIN UserProfiles ON UserProfiles._id = Posts._uid
	WHERE _private = 0)x
    LEFT JOIN PostLikes ON PostLikes._pid = x._pid
    LEFT JOIN PostSaves ON PostSaves._pid = x._pid
	ORDER BY RAND()
	LIMIT 0,10;
    
CREATE TABLE PostLikes(_uid INT, FOREIGN KEY(_uid) REFERENCES UserAccounts(_id), _pid INT, FOREIGN KEY(_pid) REFERENCES Posts(_pid), UNIQUE(_uid, _pid) );
DROP TABLE PostLikes;
SELECT * FROM PostLikes;
CREATE TABLE PostSaves(_uid INT, FOREIGN KEY(_uid) REFERENCES UserAccounts(_id), _pid INT, FOREIGN KEY(_pid) REFERENCES Posts(_pid), UNIQUE(_uid, _pid) );
DROP TABLE PostLikes;

select Posts.*, PostLikes._uid = 3 as liked, PostSaves._uid = 3 as saved from Posts 
LEFT JOIN PostLikes ON Posts._pid = PostLikes._pid
LEFT JOIN PostSaves ON Posts._pid = PostSaves._pid
WHERE Posts._uid = 3;
SELECT count(*) FROM Posts WHERE _uid=3;

SELECT Posts.*, UserAccounts._uname, UserProfiles._pfp, PostLikes._uid = 3 from Posts
	INNER JOIN UserAccounts ON UserAccounts._id = Posts._uid
	INNER JOIN UserProfiles ON UserProfiles._id = Posts._uid
	LEFT JOIN PostLikes ON PostLikes._pid = Posts._pid
	LEFT JOIN PostSaves ON PostSaves._pid = Posts._pid
		WHERE PostSaves._uid = 3;
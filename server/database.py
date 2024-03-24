import mysql.connector

class dbase:
    def init(self):
        self.connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='ViciousCat@123',
            database='Kite'
        )
        self.cursor = self.connection.cursor()

    def CreateUser(self, data):
        try:
            self.cursor.execute(f""" 
                INSERT INTO UserAccounts(_uname, _pass, _email) VALUE (
                                "{data['_uname']}", 
                                "{data['_pass']}", 
                                "{data['_email']}"
                )
            """)
            self.connection.commit()


            self.cursor.execute(f"""
                SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}"
            """)
            x = self.cursor.fetchone()[0]

            self.cursor.execute(f"""
                INSERT INTO UserProfiles VALUE (
                                    {x},
                                    "",
                                    "",
                                    "def/pfp"      
                )
            """)
            self.connection.commit()

            return {'error':0, '_id': x}
        except mysql.connector.Error as e:
            print('Error: ', e)
            if(e.msg.find('_email') != -1):
                return {'error':e.errno, 'msg':'User with this email id already exists'}
                
            if(e.msg.find('_uname') != -1):
                return {'error':e.errno, 'msg':'User with this user name id already exists'}
            
            return {'error':-1, 'msg':'unknown Error occurred'}
        
    def ValidateUser(self, data):
        try:
            self.cursor.execute(f"""
                SELECT _pass, _id from UserAccounts WHERE _email = "{data['_email']}"
            """)
            x = self.cursor.fetchone()
            if x == None:
                return {'error': 901, 'msg': 'user not found'}
            
            if x[0] == data['_pass']:
                return { 'error': 0, '_id': x[1]}
            else:
                return { 'error': 902, 'msg': 'incorrect password'}
        except mysql.connector.Error as e:
            return {'error' : e.errno, 'msg' : e.msg}
        
    def GetProfile(self, data):
        try:
            self.cursor.execute(f"""
                SELECT AC._uname, UP._rname, UP._bio, UP._pfp, AC._email FROM UserProfiles as UP 
                INNER JOIN UserAccounts as AC ON AC._id = UP._id WHERE AC._id = {data['_id']} AND AC._pass = "{data['_pass']}"
            """)
            x = self.cursor.fetchone()
            if(x == None):
                return {'error': 801, 'msg':'something went wrong'}
            
            self.cursor.execute(f"""
                SELECT count(*) FROM FriendsRelationship WHERE _following={data['_id']};
            """)
            z = (self.cursor.fetchone())[0]
            self.cursor.execute(f"""
                SELECT count(*) FROM FriendsRelationship WHERE _follower={data['_id']};
            """)
            q = (self.cursor.fetchone())[0]
        
            return {'error':0, '_uname':x[0],  '_rname': x[1], '_bio' : x[2], '_pfp' : x[3], '_email' : x[4], '_follower': z, '_following': q}
        except mysql.connector.Error as e:
            return {'error':e.errno, 'msg':e.msg}
    
    def UpdateProfile(self, data):
        try:
            self.cursor.execute(f"""
                SELECT * FROM UserAccounts WHERE _id = {data['_id']} AND _pass = "{data['_pass']}"
            """)
            x = self.cursor.fetchone()
            if(x == None):
                return {'error': 801, 'msg':'something went wrong'}
            
            self.cursor.execute(f"""
                UPDATE UserProfiles SET _rname = "{data['_rname']}", _bio = "{data['_bio']}", _pfp = "{data['_pfp']}" WHERE _id = {data['_id']}
            """)
            self.cursor.execute(f"""
                UPDATE UserAccounts SET _uname = "{data['_uname']}", _email = "{data['_email']}", _pass = "{data['_repass']}" WHERE _id = {data['_id']};
            """)
            return {'error':0, 'msg':''}
        except mysql.connector.Error as e:
            print(e.msg)
            if e.errno == 1062:
                if e.msg.find('_uname') != -1:
                    return {'error':e.errno, 'msg':'User with this user name already exists'}
                if e.msg.find('_email') != -1:
                    return {'error':e.errno, 'msg':'User with this email already exists'}
            return {'error':e.errno, 'msg':e.msg}
        
    def Search(self, data):
        try:
            self.cursor.execute(f"""
                SELECT AC._uname, UP._rname, UP._pfp FROM UserProfiles as UP
                INNER JOIN UserAccounts as AC
                ON AC._id = UP._id
                WHERE AC._uname LIKE "%{data['_name']}%" OR UP._rname LIKE "%{data['_name']}%"
            """)

            x = self.cursor.fetchall()
            return {'error': 0, '_data': x}
        except mysql.connector.Error as e:
            return {'error':e.errno, 'msg':e.msg}
        
    def GetOthersProfile(self, data):
        try:
            self.cursor.execute(f"""
                                SELECT UP._rname, UP._bio, UP._pfp FROM UserProfiles as UP 
		                        INNER JOIN UserAccounts as AC ON AC._id = UP._id WHERE AC._uname = "{data['_uname']}"
            """)

            x = self.cursor.fetchone()
            if(x == None):
                return {'error': 801, 'msg':'something went wrong'}
            
            self.cursor.execute(f"""
                SELECT _uname FROM UserAccounts WHERE _id = {data['_id']}
            """)
            
            usr = self.cursor.fetchone()[0]
            
            self.cursor.execute(f"""
                    SELECT * FROM FriendsRelationship WHERE _follower = {data['_id']} AND _following = (SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}");
                """)
            r = self.cursor.fetchone()
            self.cursor.execute(f"""
                SELECT count(*) FROM FriendsRelationship WHERE _following=(SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}");
            """)
            z = (self.cursor.fetchone())[0]
            self.cursor.execute(f"""
                SELECT count(*) FROM FriendsRelationship WHERE _follower=(SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}");
            """)
            q = (self.cursor.fetchone())[0]
        
            
            return {'error':0, '_rname': x[0], '_bio' : x[1], '_pfp' : x[2], '_uname': usr, '_follower': z, '_following': q, '_doesFollow': ('Following' if r != None else 'Follow')}
        except mysql.connector.Error as e:
            return {'error':e.errno, 'msg':e.msg}
    
    def FollowRequest(self, data):
        try:
            self.cursor.execute(f"""
                INSERT INTO FriendsRelationship VALUES ({data['_id']}, (SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}"));
            """)
            self.connection.commit()
            self.cursor.execute(f"""
                INSERT INTO Notifications VALUES ((SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}"), CURDATE(), CONCAT((SELECT _uname FROM UserAccounts WHERE _id = "{data['_id']}"), " Started Following You. - "), FALSE);
            """)
            self.connection.commit()

            return {'error':0, '_action': 'Following'}
        except mysql.connector.Error as e:
            if e.errno == 1062:
                self.cursor.execute(f"""
                    DELETE FROM FriendsRelationship WHERE _follower = {data['_id']} AND _following = (SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}");
                """)
                self.connection.commit()
                return {'error': 0, 'action': 'Follow'}                
            return {'error':e.errno, 'msg':e.msg}
    
    def GetRelations(self, data):
        try:
            if data['_useUname'] == False:
                if data['_get'] == 'Followers':
                   self.cursor.execute(f"""
                        SELECT UserProfiles._pfp, (SELECT _uname FROM UserAccounts WHERE _id = UserProfiles._id), UserProfiles._rname 
                        	FROM UserProfiles 
                            INNER JOIN FriendsRelationship 
                            ON UserProfiles._id = FriendsRelationship._follower 
	                        WHERE FriendsRelationship._following = {data['_id']};
                    """)
                elif data['_get'] == 'Following':
                   self.cursor.execute(f"""
                        SELECT UserProfiles._pfp, (SELECT _uname FROM UserAccounts WHERE _id = UserProfiles._id), UserProfiles._rname 
	                        FROM UserProfiles 
                            INNER JOIN FriendsRelationship 
                            ON UserProfiles._id = FriendsRelationship._following
    	                    WHERE FriendsRelationship._follower = {data['_id']};
                    """)
            else:
                if data['_get'] == 'Followers':
                   self.cursor.execute(f"""
                        SELECT UserProfiles._pfp, (SELECT _uname FROM UserAccounts WHERE _id = UserProfiles._id), UserProfiles._rname 
                        	FROM UserProfiles 
                            INNER JOIN FriendsRelationship 
                            ON UserProfiles._id = FriendsRelationship._follower 
	                        WHERE FriendsRelationship._following = (SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}");
                    """)
                elif data['_get'] == 'Following':
                   self.cursor.execute(f"""
                        SELECT UserProfiles._pfp, (SELECT _uname FROM UserAccounts WHERE _id = UserProfiles._id), UserProfiles._rname 
	                        FROM UserProfiles 
                            INNER JOIN FriendsRelationship 
                            ON UserProfiles._id = FriendsRelationship._following
    	                    WHERE FriendsRelationship._follower = (SELECT _id FROM UserAccounts WHERE _uname = "{data['_uname']}");
                    """)
                
            return {'error':0, 'data': self.cursor.fetchall()}
        except mysql.connector.Error as e:
            print(e.msg)

            return {'error':e.errno, 'msg':e.msg}

    def GetNotifications(self, data):
        try:
            self.cursor.execute(f"""
                SELECT CONCAT(_msg, DATEDIFF(_date, CURDATE()), " days ago"), _read FROM Notifications WHERE _id = {data['_id']};
            """)
            x = self.cursor.fetchall()
            self.cursor.execute(f"""
                SELECT * FROM Notifications WHERE _id = {data['_id']} AND _read = FALSE;
            """)
            y = self.cursor.fetchall()
            print(y)
            if y.__len__ != 0:
                unread = True
                self.cursor.execute(f"""
                    UPDATE Notifications SET _read = TRUE WHERE _id = {data['_id']};
                """)
                self.connection.commit()
            else: unread = False

            return {'error': 0, '_data': x, '_unread': unread}
        except mysql.connector.Error as er:
            pass

    def SavePost(self, data):
        try:
            self.cursor.execute(f"""
                INSERT INTO Posts(_uid, _img, _text) VALUE ({data['_id']}, "{data['_img']}", "{data['_text']}");
            """)
            self.connection.commit()
            return {'error': 0}
        except mysql.connector.Error as er:
            return {'error':er.errno, 'msg': er.msg}

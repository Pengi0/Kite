from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import database
import base64
import random
import string
import os
app = Flask(__name__)
CORS(app)

dbase = database.dbase()
dbase.init()


def save_base64_to_file(base64_string, file_path):
    try:
        decoded_data = base64.b64decode(base64_string)

        with open(file_path, 'wb') as file:
            file.write(decoded_data)
        print("File saved successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

def save_img(base64):
    try:
        res1 = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=7))
        res2 = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=7))
        loc = os.getcwd() + '/server/Images/' + res1 + '/' + res2 + '/'
        os.makedirs(loc)
        save_base64_to_file(base64, loc+'img.jpeg')
        return res1+'/'+res2
    except OSError as e:
        print(f"Failed to create directories: {e}")


@app.route('/', methods=['POST'])
def handleRequest():
    data = request.json
    # print(data)
    x = {'error': -1}
    if data['type'] == 'create-user':
        x = dbase.CreateUser(data)
        print(x)
    elif data['type'] == 'validate-user':
        x = dbase.ValidateUser(data)
    elif data['type'] == 'get-profile':
        x = dbase.GetProfile(data)
    elif data['type'] == 'update-profile':
        x = dbase.UpdateProfile(data)
    elif data['type'] == 'search-accounts':
        x = dbase.Search(data)
    elif data['type'] == 'get-others-profile':
        x = dbase.GetOthersProfile(data)
        print(x)
    elif data['type'] == 'follow-request':
        x = dbase.FollowRequest(data)
    elif data['type'] == 'get-relations':
        x = dbase.GetRelations(data)
        print(x)
    elif data['type'] == 'get-notifications':
        x = dbase.GetNotifications(data)
    elif data['type'] == 'create-post':
        x = dbase.SavePost(data)
    elif data['type'] == 'post-img':
        loc = save_img(data['base64'])
        x = {'error':0, 'loc': loc}
    return jsonify(x)

@app.route('/<s1>/<s2>/')
def send_image(s1, s2):
    loc = os.getcwd() + '/server/Images/' + s1 + '/'+s2+'/img.jpeg'
    
    return send_file(loc, mimetype='image/jpeg')


if(__name__ == "__main__"):
	app.run(debug=True)

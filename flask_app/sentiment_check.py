from flask import Flask
from flask import request
from sentiment import get_sentiment
from threading import Thread

app = Flask(__name__)

@app.route('/')
def index():
    param = request.args.get("name")  #get paramater from GET request
    print("param: " + str(param))


    from firebase import firebase #importing here to stop weird bug
    firebase = firebase.FirebaseApplication("https://charity-check.firebaseio.com/", None)

    result = firebase.get('/', param)

    print(type(result))

    if result != None:
        return str(result)
    else:
        t = Thread(target=get_sentiment, args=(param, ))
        t.start()
        return '[]'

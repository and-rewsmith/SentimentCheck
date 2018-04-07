from flask import Flask
from flask import request
from sentiment import get_sentiment
import sqlite3
from threading import Thread

app = Flask(__name__)

@app.route('/charity')
def charity():
    param = request.args.get("name")  #get paramater from GET request
    print("param: " + str(param))
    t = Thread(target=get_sentiment, args=(param, ))
    t.start()
    return '[]'

@app.route("/")
def index():
    return '[]'

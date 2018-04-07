from flask import Flask
from flask import request
from sentiment import get_sentiment
import sqlite3
from threading import Thread

app = Flask(__name__)

@app.route('/charity')
def index():
        param = request.args.get("name")  #get paramater from GET request
        print("param: " + str(param))

        if param != None:
            conn = sqlite3.connect('db/sentiments.db')
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM sentiments WHERE name='{}'".format(param))
            sentiments = cursor.fetchall()

            if len(sentiments) == 0:
                t = Thread(target=get_sentiment, args=(param, ))
                t.start()
                return '[]'

            else:
                return "[{}, {}]".format(sentiments[0][1], sentiments[0][2])

        else:
            return '[]'

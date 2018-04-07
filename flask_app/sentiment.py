import got3
from proxy_handler import get_proxy
from textblob import TextBlob
import sqlite3

def get_sentiment(name):

    for i in range(0, 10):
        try:
            proxy = get_proxy()
            tweetCriteria = got3.manager.TweetCriteria().setQuerySearch(name).setMaxTweets(10)
            tweets = got3.manager.TweetManager.getTweets(tweetCriteria, proxy=proxy)
            break
        except: #Twitter has a lot of countermeasures around this so it is easier to not specify every exception
            pass


    polarity_per_tweet = []
    subjectivity_per_tweet = []
    for t in tweets:
        blob = TextBlob(t.text)
        polarity = blob.sentiment[0]
        polarity_per_tweet.append(polarity)
        subjectivity = blob.sentiment[1]
        subjectivity_per_tweet.append(subjectivity)

    mean_sentiment = [sum(polarity_per_tweet) / len(polarity_per_tweet)]
    mean_sentiment.append(sum(subjectivity_per_tweet) / len(subjectivity_per_tweet))

    conn = sqlite3.connect('db/sentiments.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO sentiments VALUES ('{}', {}, {})".format(str(name), str(mean_sentiment[0]), str(mean_sentiment[1])))
    conn.commit()
    cursor.execute("SELECT * FROM sentiments")
    print(cursor.fetchall())
    conn.close()


    return mean_sentiment

if __name__ == "__main__":
    print(get_sentiment("Trump"))


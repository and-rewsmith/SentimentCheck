import got3
from proxy_handler import get_proxy
from textblob import TextBlob
import sqlite3
import json

def get_sentiment(name):

    tweets = None
    for i in range(0, 50):
        try:
            proxy = get_proxy()
            tweetCriteria = got3.manager.TweetCriteria().setQuerySearch(name).setMaxTweets(100)
            tweets = got3.manager.TweetManager.getTweets(tweetCriteria, proxy=proxy)
            break
        except: #Twitter has a lot of countermeasures around this so it is easier to not specify every exception
            pass

    if len(tweets) == 0:
        return


    polarity_per_tweet = []
    subjectivity_per_tweet = []
    all_info = []
    for t in tweets:
        blob = TextBlob(t.text)
        polarity = blob.sentiment[0]
        polarity_per_tweet.append(polarity)
        subjectivity = blob.sentiment[1]
        subjectivity_per_tweet.append(subjectivity)
        score = 2*t.retweets + t.favorites
        all_info.append([t, polarity, subjectivity, score])

    all_info.sort(key=lambda x:x[1])

    negative_tweets = []
    positive_tweets = []
    top_tweets = []


    for i in range(-1, -11, -1):
        if ((i * -1)-1) < len(tweets)//2:
            positive_tweets.append(all_info[i][0].id)
            #print(all_info[i][0].text)
        else:
            break

    #print()

    for i in range(0, len(tweets)):
        if i < len(tweets)//2:
            negative_tweets.append(all_info[i][0].id)
            #print(all_info[i][0].text)
        else:
            break

    #print()

    all_info.sort(key=lambda x:x[3])

    for i in range(-1, -11, -1):
        if ((i*-1)-1) < len(tweets) // 2:
            top_tweets.append(all_info[i][0].id)
            #print(all_info[i][0].text)
        else:
            break

    #print()

    mean_sentiment = []
    mean_sentiment.append(sum(polarity_per_tweet) / len(polarity_per_tweet))
    mean_sentiment.append(sum(subjectivity_per_tweet) / len(subjectivity_per_tweet))

    #print(mean_sentiment)
    #print()
    #print(negative_tweets)
    #print()
    #print(positive_tweets)
    #print()
    #print(top_tweets)

    charity_dict = {'name': name, 'sentiment':mean_sentiment, 'positive':positive_tweets, 'negative':negative_tweets, 'top':top_tweets}

    json_dict = json.dumps(charity_dict)

    json_dict = json.loads(json_dict)

    from firebase import firebase
    firebase = firebase.FirebaseApplication('https://charitycheck-check.firebaseio.com/', None)

    #r = requests.post("https://charitycheck-check.firebaseio.com/", data=json_dict)

    result = firebase.post("/charities", json_dict)

    print(json_dict)
    print(type(json_dict))


if __name__ == "__main__":
    print(get_sentiment("Andrew"))


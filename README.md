# CharityCheck

## Description
This project was made for WiCs Hack for Humanity 2018. In this competition, our team won the top prize: 

__Winner: Best Humanity Hack__

We created a sentiment analysis web-service for Twitter, where users can obtain sentiment data for any given keyword. Our service also returns embedded html for the most positive/negative/popular tweets.

## Design
We used Flask to model the backend of this service. When a user hits the main endpoint (with the desired search term in the GET param), our service attempts to respond with a json dictionary of sentiment data (see above). 

There are two cases from this point. Either:
1. Sentiment data is already persisted from a past request.
2. No sentiment data exists (i.e. this is the first time we have seen this keyword).

If there is archived sentiment for the keyword, we respond a json dictionary of sentiment data.

If there is no archived sentiment for the keyword, we begin scraping twitter for relevant tweets and respond with a "We are working on it" message. When the user makes a request later, there will be archived sentiment and we can give a real response.

Additionally, we did not use the Twitter API to obtain these tweets. We scrape the site manually using rotating proxies. 

When this goes live we will use cron-jobs to keep our persisted data up to date.

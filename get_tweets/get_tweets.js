require('dotenv').config();

const Twitter = require('twitter');
   const client = new Twitter({
   consumer_key: process.env.TWITTER_CONSUMER_KEY,
   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,           
   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const stream = client.stream('statuses/filter', {track: '#lgbt', tweet_mode: 'extended'});

stream.on('data', (data) => {
   if (!data.retweeted_status) {
      const tweetos = data.user.screen_name;
      const tweetText = data?.extended_tweet?.full_text || data.text;
      const tweetFrom = data?.place?.country_code || data.user?.location;
      const tweetLanguage = data?.lang || data.user?.lang;
      console.log("@", tweetos, "\na tweeté ", tweetText, "\nà ", tweetFrom, '\nen', tweetLanguage );
   }
});

stream.on('error', (error) => {
   throw error;
});
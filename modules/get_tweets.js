const { MongoClient } = require("mongodb");
const Twitter=require('twitter');
const  OpenAI  = require('openai-api');

const uri = "mongodb://" + process.env.USER + ":" + process.env.PASS + "@" + process.env.BDD_HOST + ":" + process.env.BDD_PORTS + "/?maxPoolSize=20&w=majority";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const client = new Twitter({
   consumer_key: process.env.TWITTER_CONSUMER_KEY,
   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let positiveTweets
let negativeTweets
let tweets = []

MongoClient.connect(uri, function (err, db) {
   if (err) throw err;

   var dbo = db.db("undefined");

   dbo.collection("tweets").find({}).toArray(function (err, result) {
      if (err) throw err;

      positiveTweets = result[0]['positive_tweets'];
      negativeTweets = result[1]['negative_tweets'];

      tweets = [positiveTweets, negativeTweets]

      db.close();
   });

})

async function classification(tweet) {
   try {

      const classificatedTweet = await openai.classification({
         examples: [
            ['A happy moment', 'Positive'],
            ['I am sad.', 'Negative'],
            ['I am feeling awesome', 'Positive']
         ],
         labels: ['Positive', 'Negative', 'Neutral'],
         query: tweet,
         search_model: 'curie',
         model: 'curie'
      });

      if (classificatedTweet['data']['label'] === "Positive") {
         positiveTweets++
      } else if (classificatedTweet['data']['label'] === "Negative") {
         negativeTweets++
      }

      MongoClient.connect(uri, function (err, db) {
         if (err) throw err;

         var dbo = db.db("undefined");

         dbo.collection("tweets").updateMany({},
            { $set: { positive_tweets: positiveTweets, negative_tweets: negativeTweets } },
            function (err, res) {
               if (err) throw err;
               db.close();
            }
         )

      });

   }

   catch (e) {
      console.error(e)
   }
}



const stream = client.stream('statuses/filter', {screen_name:'nodejs', track: '#lgbt', tweet_mode: 'extended' })

stream.on('data', (data) => {
   //console.log(data);
   if (!data.retweeted_status) {
      const tweetText = data?.extended_tweet?.full_text || data.text;
      classification(tweetText)
   }
});

stream.on('error', (error) => {
   console.log(error);
   throw error;
});

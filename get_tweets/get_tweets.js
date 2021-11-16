//require('dotenv').config();
import dotenv from 'dotenv'
dotenv.config();
import Twitter from 'twitter';
import { OpenAI } from 'openai';
import express from 'express'
let app = express()
import {MongoClient} from "mongodb"
import http from "http"
let server = http.Server(app)

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

MongoClient.connect(uri, function (err, db) {
   if (err) throw err;

   var dbo = db.db("undefined");

   dbo.collection("tweets").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);

      positiveTweets = result[0]['positive_tweets'];
      negativeTweets = result[1]['negative_tweets'];

      console.log("Positive tweets in DB : "+positiveTweets+"\nNegative tweets in DB : "+negativeTweets)

      db.close();
   });

})

async function classification (tweet) {

   try {

      const classificatedTweet = await openai.classify({
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

   console.log(classificatedTweet)

   if (classificatedTweet['label'] === "Positive"){
      positiveTweets++
   } else if (classificatedTweet['label'] === "Negative"){
      negativeTweets++
   }

   console.log("Positive tweets : "+positiveTweets+"\nNegative tweets : "+negativeTweets)

   MongoClient.connect(uri, function (err, db) {
      if (err) throw err;

      var dbo = db.db("undefined");

      dbo.collection("tweets").updateMany({ }, 
         { $set: { positive_tweets: positiveTweets, negative_tweets: negativeTweets }},
         function(err, res) {
            if (err) throw err;
            console.log(res.matchedCount + " document(s) updated")
            db.close();
         }
      )

   });
   
   console.log('==================================================================================================================================================')
   }

   catch (e) {
      console.error(e)
   }
}

const stream = client.stream('statuses/filter', {track: '#lgbt', tweet_mode: 'extended'});

stream.on('data', (data) => {
   if (!data.retweeted_status) {
      const tweetos = data.user.screen_name;
      const tweetText = data?.extended_tweet?.full_text || data.text;
      const tweetFrom = data?.place?.country_code || data.user?.location;
      const tweetLanguage = data?.lang || data.user?.lang;
      //console.log("@", tweetos, '\na tweeté "', tweetText, '"\nà', tweetFrom, '\nen', tweetLanguage, '\n==============================================================================================================================================' );
      console.log("Tweet : " + tweetText)
      classification(tweetText)
   }
});

stream.on('error', (error) => {
   throw error;
});

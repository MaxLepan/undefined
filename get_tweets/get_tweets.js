//require('dotenv').config();
import dotenv from 'dotenv'
dotenv.config();
import Twitter from 'twitter';
import { OpenAI } from 'openai';
let express = require('http')
const { MongoClient } = require("mongodb");
let app = express()
let http = require("http");
let server = http.Server(app)

const uri = "mongodb://" + process.env.USER + ":" + process.env.PASS + "@" + process.env.BDD_HOST + ":" + process.env.BDD_PORTS + "/?maxPoolSize=20&w=majority";

const openai = new OpenAI(process.env.OPENAI_API_KEY);
const engine = await openai.getEngine('curie');

const client = new Twitter({
   consumer_key: process.env.TWITTER_CONSUMER_KEY,
   consumer_secret: process.env.TWITTER_CONSUMER_SECRET,           
   access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
   access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let positiveTweets
let negativeTweets

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


function findAll(uri, database, collection, callback){

   if (!String.isNullOrEmpty(database) && !String.isNullOrEmpty(collection)){

      MongoClient.connect(uri, function (err, db) {
         if (err) throw err;

         var dbo = db.db(database);

         dbo.collection(collection).find({}).toArray(function (err, result) {
            if (err) throw err;
               db.close();

            if (typeof callback == "function" && callback != null)
               callback(result);

         });

     });

   }
}
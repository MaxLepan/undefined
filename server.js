//require('dotenv').config();

let express = require("express")
const { MongoClient } = require("mongodb");
require('dotenv').config()
let app = express()
let http = require("http");
var path = require("path");
let server = http.Server(app)
app.set('view engine', 'ejs');
const uri = "mongodb://" + process.env.USER + ":" + process.env.PASS + "@" + process.env.BDD_HOST + ":" + process.env.BDD_PORTS + "/?maxPoolSize=20&w=majority";
var __dirname = path.resolve();
app.use(express.static(__dirname + "/src"));

console.log(uri);

let pays2020;
let pays2017;

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}



FindAll(uri, "pays2020", (resPays2020) => {
    pays2020 = resPays2020;



})

FindAll(uri, "pays2017", (resPays2017) => {
    pays2017 = resPays2017;
})


function GetPaysWhere(annee, attribute = "type",match = "9",callback) {

    let dataPays;
    let dataReturned = [];
    dataReturned[0] = {};

    if (annee.includes("2020")) {
        dataPays = pays2020;
    } else if (annee.includes("2017")) {
        dataPays = pays2017;
    } else {
         callback(dataReturned);
    }

    for (pays of dataPays) {
        for (let [paysName, paysValue] of Object.entries(pays)) {

            if(paysValue[attribute] == match){
            
                dataReturned[0][paysName] = paysValue;
           
            }

        }
        
    }
    callback(dataReturned)
}


require(__dirname + "/modules/get_tweets.js")(uri, app);

app.get("/", (req, res) => {

    res.render(__dirname + "/src/html/index.ejs", { test: "hello" });

})
app.get("/map", (req, res) => {


    let paysCrime

    GetPaysWhere("2020","type","9",(res)=>{
        paysCrime = res
    })

    res.render(__dirname + "/src/html/map.ejs", { pays2020, pays2017,paysCrime });


})

//Find all collection

function FindAll(uri, collection, callback) {




    MongoClient.connect(uri, function (err, db) {
        if (err) throw err;

        var dbo = db.db("undefined");

        dbo.collection(collection).find({}).toArray(function (err, result) {
            if (err) throw err;
            db.close();

            if (typeof callback == "function" && callback != null)
                callback(result);

        });

    });




}

//----Port d'ecoute
server.listen(8002, function () {
    console.log("listning at : 8002")
})

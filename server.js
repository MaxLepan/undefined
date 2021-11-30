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
const fs = require('fs');

let db_pays2020;
let db_pays2017;


let paysProteger2020;
let paysNeutre2020;
let paysCrime2020;

let paysProteger2017;
let paysNeutre2017;
let paysCrime2017;


let country;

fs.readFile('./src/ressources/country.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

        // parse JSON string to JSON object
        country = JSON.parse(data);
    }

});

let capitals;

fs.readFile('./src/ressources/capitals.json', 'utf8', (err, data) => {

    if (err) {
        console.log(`Error reading file from disk: ${err}`);
    } else {

        // parse JSON string to JSON object
        capitals = JSON.parse(data);
    }

});



//Vient chercher les pays dans la db au lancement du serveur
FindAll(uri, "db_pays2020", (resPays2020) => {
    db_pays2020 = resPays2020;
    FindAll(uri, "db_pays2017", (resPays2017) => {
        db_pays2017 = resPays2017;
        bindPaysIndice();
    })
})






//On assemble les pays protegés, Neutre et Non protegés ensemble.
function bindPaysIndice(){
    PaysProtege("2020",(res)=>{
        paysProteger2020 = res        
    })
    
    PaysNeutre("2020",(res)=>{
        paysNeutre2020 = res        
    })

    PaysCrime("2020",(res)=>{
        paysCrime2020 = res        
    })


    PaysProtege("2017",(res)=>{
        paysProteger2017 = res        
    })
    
    PaysNeutre("2017",(res)=>{
        paysNeutre2017 = res        
    })

    PaysCrime("2017",(res)=>{
        paysCrime2017 = res        
    })

    
    console.log("Tous les pays on été binds")
}




//Vient chercher le module getTweet;
let leResultatDesTweets = require(__dirname + "/modules/get_tweets.js")(uri, app);
console.log(leResultatDesTweets)




//Quand le client (navigateur) est l'adresse localhost:8002 , On lui renvoie la page index
app.get("/", (req, res) => {

    res.render(__dirname + "/src/html/index.ejs", { test: "hello" });

})

// Attention, l'url /map est alors utilisé. Il est impossible de créer les 2 meme routes pour envoyer des informations differentes
//Quand le client (navigateur) est l'adresse localhost:8002/map , On lui renvoie la map avec la liste des pays initialisés au dessus.
app.get("/map", (req, res) => {

    res.render(__dirname + "/src/html/map.ejs", { db_pays2020, paysProteger2020, paysNeutre2020,paysCrime2020,paysProteger2017, paysNeutre2017,paysCrime2017, country,capitals});
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



function PaysProtege(annee,callback) {

    let dataPays;
    let dataReturned = [];
    dataReturned[0] = {};

    if (annee.includes("2020")) {
        dataPays = db_pays2020;
    } else if (annee.includes("2017")) {
        dataPays = db_pays2017;
    } else {
        callback(dataReturned);
    }

    for (pays of dataPays) {
        for (let [paysName, paysValue] of Object.entries(pays)) {

            if(paysValue.type == "1" ||paysValue.type == "2" || paysValue.type == "3" || paysValue.type == "4"   ){

                dataReturned[0][paysName] = paysValue;

            }

        }

    }
    callback(dataReturned)
}



function PaysNeutre(annee,callback) {

    let dataPays;
    let dataReturned = [];
    dataReturned[0] = {};

    if (annee.includes("2020")) {
        dataPays = db_pays2020;
    } else if (annee.includes("2017")) {
        dataPays = db_pays2017;
    } else {
        callback(dataReturned);
    }

    for (pays of dataPays) {
        for (let [paysName, paysValue] of Object.entries(pays)) {

            if(paysValue.type == "5" ||paysValue.type == "6" ){

                dataReturned[0][paysName] = paysValue;

            }

        }

    }
    callback(dataReturned)
}


function PaysCrime(annee,callback) {

    let dataPays;
    let dataReturned = [];
    dataReturned[0] = {};

    if (annee.includes("2020")) {
        dataPays = db_pays2020;
    } else if (annee.includes("2017")) {
        dataPays = db_pays2017;
    } else {
        callback(dataReturned);
    }

    for (pays of dataPays) {
        for (let [paysName, paysValue] of Object.entries(pays)) {

            if(paysValue.type == "7" ||paysValue.type == "8" ||paysValue.type == "9" ){

                dataReturned[0][paysName] = paysValue;

            }

        }

    }
    callback(dataReturned)
}




//----Port d'ecoute
server.listen(8002, function () {
    console.log("listning at : http://localhost:8002")
})

"use stict"

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
require('request');
const rp = require('request-promise');
var twitter = require('twitter');
//const rp = require('jquery');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

function randomGenerator(min, max)
{
    return ( min + Math.floor( Math.random() * (max - min) ) );
}

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
// https://us-central1-bitcoin-oracle-5f725.cloudfunctions.net/addMessage?text=samplestring
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;

    // Todo: Find out why function keeps on getting called if we don't
    // add to /messages
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      addTweets(original);
      return res.redirect(303, snapshot.ref.toString());
    });
  });

function addTweets(tweetDate) {
    var tweetObj = {
        tweets: [
        ],
        bitcoinPrice: 4500,
        sentimentPrice: 5000
    }   

    tweetObj.bitcoinPrice = randomGenerator(3000, 20000);
    tweetObj.sentimentPrice = randomGenerator(3000, 20000);
    var tweetNum = randomGenerator(3, 10);
    for (let i = 0; i < tweetNum; ++i) {
        let tObj = {tweet: "Tweet" + i, url: "URL"+ i};
        tweetObj.tweets.push(tObj);    
    }

    let refPath = "/dates/"+tweetDate;
    //   let dateRef = admin.database().ref('/dates').update(dateobj);
    return admin.database().ref(refPath).set(tweetObj);
}

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
.onCreate((snapshot, context) => {
  // Grab the current value of what was written to the Realtime Database.
  const original = snapshot.val();
  console.log('Uppercasing', context.params.pushId, original);
  const uppercase = original.toUpperCase();
  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to the Firebase Realtime Database.
  // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  return snapshot.ref.parent.child('uppercase').set(uppercase);
});

// URL: 
// https://us-central1-bitcoinprice-208905.cloudfunctions.net/helloWorld
exports.helloWorld = functions.https.onRequest((req, res) => {
    var movie = "Pulp Fiction"
  
    // rp.get(queryURL, function (error, response, body) {
    //     console.log('error:', error); // Print the error if one occurred 
    //     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
    //     console.log('body:', body); //Prints the response of the request. 
    //   });
    //   res.status(200).send("Success");


    // var movie = $(this).attr("data-movie");
    let appKey = "3AzDFpfTyJGXuBgEAeMFLz2LDCKAEJHl";
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        movie + "&api_key=" + appKey + "&limit=10";

        var options = {
            uri: queryURL,
            // qs: {
            //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
            // },
            // headers: {
            //     'User-Agent': 'Request-Promise'
            // },
            json: true // Automatically parses the JSON string in the response
        };
    return rp(options)
            .then(function (repos) {
                // console.log(JSON.stringify(repos));
                var results = repos.data;
                console.log('User has %d repos', results.length);

                for (var i = 0; i < results.length; i++) {
                    let gifData = results[i];
                    // var gifDiv = $("<div>").addClass("ajax-item");
        
                    console.log(gifData.title);
                    console.log(gifData.images.fixed_height_still.url);
                    console.log(gifData.images.fixed_height.url);
                }
                return this;
            });
            // .catch(function (err) {
            //     console.log("Api call failed");
            //     // API call failed...
                
            // });
})
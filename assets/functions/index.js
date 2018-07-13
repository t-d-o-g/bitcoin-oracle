"use stict"

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
require('request');
const rp = require('request-promise');
var Twitter = require('twitter');

var config = {
    consumer_key: '65CEg6roRTFMjkV9r0uo7Sssw',
    consumer_secret: 'FSuWyUQrl3mDTI4oF0XQRoxg6PlsBzBZrriIyR8SybXPRAgiUA',
    access_token_key: '1016727382185660416-0ImOTX0aZ1MKDCMLhFLT4E0eyM7TDE',
    access_token_secret: 'Lmnz4hj4A4GrWrRP59CpR6misquFfyWbn2IImvSCptPe0'
}

let bitcoinTweets = [
    "this is price of bitcoin",
    "bitcoin will increase",
    "price will decrease of bitcoin",
    "bitcoin is the future",
    "bitcoin is the past",
    "bitcoin is number 1",
    "finance world will use bitcoin",
    "Next year bitcoin will be up",
    "bitcoin can't keep on going up",
    "bitcoin is good",
    "nothing good about bitcoin",
    "bitcoin needs regulation",
    "bitcoin shouldn't be regulated",
    "bitcoin in ecommerce",
    "bitcoin is anonymous",
    "bitcoin is for drug dealers",
    "bitcoin is for everyone"
]

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

function randomGenerator(min, max) {
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

exports.getTweets = functions.https.onRequest((req, res) => {
    var T = new Twitter(config);
    // Set up your search parameters
    var params = {
        q: '#bitcoin',
        count: 3,
        lang: 'en',
        until: '2018-07-09'
    }

    // Initiate your search using the above paramaters
    T.get('search/tweets', params, function(err, data, response) {
        // If there is no error, proceed
        if (!err) {
            // Loop through the returned tweets
            for (let i = 0; i < data.statuses.length; i++) {
                // Get the tweet Id from the returned data
                let id = { id: data.statuses[i].id_str }
                // Try to Favorite the selected Tweet
                T.post('favorites/create', id, function(err, response) {
                    // If the favorite fails, log the error message
                    if (err) {
                        console.log(err[0].message);
                    }
                    // If the favorite is successful, log the url of the tweet
                    else {
                        let username = response.user.screen_name;
                        let tweetId = response.id_str;

                        console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`);
                        console.log('created_at:', response.created_at);
                        console.log('tweet: ', response.text);
                        if (response.entities.urls.length > 0) {
                            console.log('URL: ', response.entities.urls[0].expanded_url)
                        }
                    }
                });
            }
        } else {
            console.log(err);
        }
    })
})

function addTweets(tweetDate) {
    var tweetObj = {
        tweets: [
        ],
    }   

    var tweetNum = randomGenerator(3, 10);
    for (let i = 0; i < tweetNum; ++i) {
        let j = randomGenerator(0, bitcoinTweets.length)
        let tObj = {tweet: bitcoinTweets[j], url: "URL"+ i};
        tweetObj.tweets.push(tObj);    
    }

    let refPath = "/dates/"+tweetDate;
    return admin.database().ref(refPath).set(tweetObj);
}
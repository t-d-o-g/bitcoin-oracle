"use stict"

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// require('request');
// const rp = require('request-promise');
var Twitter = require('twitter');

var config = {
    consumer_key: functions.config().twitter.consumer_key,
    consumer_secret: functions.config().twitter.consumer_secret,
    access_token_key: functions.config().twitter.access_token_key,
    access_token_secret: functions.config().twitter.access_token_secret
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
    //   let dateRef = admin.database().ref('/dates').update(dateobj);
    return admin.database().ref(refPath).set(tweetObj);
}

exports.getTweets = functions.https.onRequest((req, res, maxId) => {
    const until = req.query.text;
    getTwitterData( {until:until} );
})

function getTwitterData(inObj) {
    console.log("inObj", inObj);
    console.log("config", config);

    var T = new Twitter(config);
    // Set up your search parameters
    var params = {
        q: '#bitcoin',
        count: 3,
        lang: 'en',
        // until: '2018-07-09'
    }

    if (inObj) {
        if (inObj.until) {
            params.until = inObj.until;
        }
        if (inObj.max_id) {
            params.max_id = inObj.max_id;
        }
    }

    console.log("params", params);
    // if (maxId) {
    //     params.max_id = maxId;
    // }

    // Initiate your search using the above paramaters
    T.get('search/tweets', params, ((err, data, response)  => {
        // If there is no error, proceed
        if (!err) {
            //console.log("response: ", response);
            processTwitResponse(data);
 
        } else {
            console.log("Error occurred", err);
        }
    }))
}

function processTwitResponse(data) {
    // Loop through the returned tweets
    for (let i = 0; i < data.statuses.length; i++) {
        // Get the tweet Id from the returned data
        let item = data.statuses[i];
        let id = { id: item.id_str }

        console.log('item:', item);

        console.log('created_at:', item.created_at);
        console.log('tweet: ', item.text);
        console.log('Id: ', item.id_str);
        if (item.entities.urls.length > 0) {
            console.log('URL: ', item.entities.urls[0].expanded_url)
        }
    }
    console.log('search_metadata json:', data.search_metadata);

    // VIK_TODO: Revisit this to find better way to check if it has the
    // property or not
    if (data.search_metadata.next_results) {
        let maxId = getMaxId(data.search_metadata.next_results);
        if (maxId) {
            console.log('meta-data:', data.search_metadata.next_results);
            getTwitterData({"max_id": maxId});
        }
    }
}

function getMaxId(nextResult) {
    let maxIdStr = "max_id=";
    let maxIdStrEnd = nextResult.indexOf(maxIdStr) + maxIdStr.length;
    let ampAfterMaxIdStr = nextResult.indexOf("&", maxIdStrEnd);
    let maxId = nextResult.slice(maxIdStrEnd, ampAfterMaxIdStr);
    return maxId;
}

// URL: 
// https://us-central1-bitcoinprice-208905.cloudfunctions.net/helloWorld
// exports.helloWorld = functions.https.onRequest((req, res) => {
//     var movie = "Pulp Fiction"  
//     let appKey = "3AzDFpfTyJGXuBgEAeMFLz2LDCKAEJHl";
//     var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
//         movie + "&api_key=" + appKey + "&limit=10";

//         var options = {
//             uri: queryURL,
//             // qs: {
//             //     access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
//             // },
//             // headers: {
//             //     'User-Agent': 'Request-Promise'
//             // },
//             json: true // Automatically parses the JSON string in the response
//         };
//     return rp(options)
//             .then(function (repos) {
//                 // console.log(JSON.stringify(repos));
//                 var results = repos.data;
//                 console.log('User has %d repos', results.length);

//                 for (var i = 0; i < results.length; i++) {
//                     let gifData = results[i];
//                     // var gifDiv = $("<div>").addClass("ajax-item");
        
//                     console.log(gifData.title);
//                     console.log(gifData.images.fixed_height_still.url);
//                     console.log(gifData.images.fixed_height.url);
//                 }
//                 return this;
//             });
//             // .catch(function (err) {
//             //     console.log("Api call failed");
//             //     // API call failed...
                
//             // });
// })
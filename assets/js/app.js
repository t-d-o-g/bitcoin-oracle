var config = {
    apiKey: "AIzaSyBMw3UmRefi3Jq0n8PrbQVUaLAu_oaFGy8",
    authDomain: "bitcoin-oracle-5f725.firebaseapp.com",
    databaseURL: "https://bitcoin-oracle-5f725.firebaseio.com",
    projectId: "bitcoin-oracle-5f725",
    storageBucket: "bitcoin-oracle-5f725.appspot.com",
    messagingSenderId: "842729680790"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  function writeTwitterData(date, bitcoinPrice, sentimentPrice, tweets) {
    firebase.database().ref('dates/' + date).set({
      bitcoinPrice: bitcoinPrice,
      sentimentPrice: sentimentPrice,
      tweets : tweets
    });
  }

  var date = moment().format("YYYYMMDD");
  var bitcoinPrice = 3500; //data from bitCoin API
  var sentimentPrice = 4500;//data from google sentiment API
  var tweets = {
      0: {tweet: "Tweet0",url: "Url0"},
      1: {tweet: "Tweet1",url: "Url1"}
  };  // data from tweet search API

  writeTwitterData(date, bitcoinPrice, sentimentPrice, tweets);

  function readTwitterData() {
      
    //Grap a database reference
    var dateRef = firebase.database().ref("dates");

    console.log(dateRef);
    //empty the tweetData div
    var tweetElement = $(".tweetData")
    tweetElement.empty();

    dateRef.on('value', function(snapshot) {

        for (i=0;i<7;i++) {

        var date = moment().subtract(i, 'days').format("YYYYMMDD");

        var bitcoinPrice = snapshot.child(date +"/bitcoinPrice").val();
        var sentimentPrice= snapshot.child(date+ "/sentimentPrice").val();
        var tweets=snapshot.child(date+"/tweets").val();

        var newDateDiv = $("<div>");
            newDateDiv.attr("class","date");
            //newDateDiv.addClass("row");

            newTitle =$("<h3>");
            newTitle.addClass("row");
            newTitle.text(date);
            newDateDiv.append(newTitle);

            for (j=0;j<tweets.length;j++) {
                var link = $("<a>");
                link.attr("href", tweets[j].url);
                link.attr("title", "tweetRef");
                link.text(tweets[j].tweet);
                console.log(tweets[j].tweet);
                link.addClass("row");

                newDateDiv.append(link); 
                
            }

        console.log(tweets);
        tweetElement.append(newDateDiv);

        }

    });

}
    


  readTwitterData();



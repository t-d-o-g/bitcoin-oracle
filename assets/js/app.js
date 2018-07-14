
    // Initialize Firebase
    var inputData = [];

    var sentimentResults = [];
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

  function readTwitterData() {
      
    //Grap a database reference
    var dateRef = firebase.database().ref("dates");

    console.log(dateRef);
    //empty the tweetData div
    var tweetElement = $(".tweetData")
    tweetElement.empty();

    dateRef.on('value', function(snapshot) {

        for (i=0;i<7;i++) {

        //var date = moment().subtract(i, 'days').format("YYYYMMDD");
        // hardcoded for now :)
        var date = "20180713";
        console.log(date);

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
                
                inputData.push(tweets[j].tweet);

                newDateDiv.append(link); 
                
            }

        console.log(tweets);
        tweetElement.append(newDateDiv);

        }

        console.log(inputData);
        console.log(inputData);
        invokeSentimentAPI(inputData);

    });

}
    


  readTwitterData();




var queryURL = "https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyAEBfvNxgOAWzD17tfRIHGJVv4dg5RjIUM";


function invokeSentimentAPI(inputData) {
        for(i=0;i<inputData.length;i++) {

            var inputObject = {
                "document":{
                    "type":"PLAIN_TEXT",
                    "content":inputData[i]
                    },
                    "encodingType":"UTF8"
            }
            // console.log(inputObject);
                           
           
            
            $.ajax({
                url: queryURL,
               dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(inputObject),
                processData: false,
                success: function( data, textStatus, jQxhr ){
                    console.log( JSON.stringify( data ) );
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    console.log( errorThrown );
                }
          
     });

   
    }

}

  

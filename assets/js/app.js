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
      var dataRef = firebase.database();

      dataRef.ref().on("value", function(snapshot) {
        var i = 0;
        snapshot.forEach(function(child) {
  
          
            inputData.push(child.val());
          


            var queryURL = "https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyAEBfvNxgOAWzD17tfRIHGJVv4dg5RjIUM";




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
        i++;
     });


    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });


   

    // Initialize Firebase
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

      dataRef.ref().on("child_added", function(snapshot) {
        // Log everything that's coming out of snapshot
        console.log(snapshot.val());

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });


     
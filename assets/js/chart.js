window.onload = function() {






    var dataPoints = [];
    var startDate = '2018-06-25';
    var endDate = '2018-07-02';
    var options =  {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Bitcoin Historic Data"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY",
        },
        axisY: {
            title: "USD",
            titleFontSize: 24,
            includeZero: false
        },
        data: [{
            type: "spline", 
            //yValueFormatString: "$#,###.##",
            dataPoints: dataPoints
        }]
    };
    
    $.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", getPrice);    
    
    function getPrice(data) {
        console.log(data.bpi.USD.rate_float);
       $("#pricedata").html(data.bpi.USD.rate_float);
    }
    
    function addData(data) {
       // var dataArray= JSON.parse(data);
        console.log(Object.getOwnPropertyNames(data.bpi).length);
      
        for (var i = 0; i < Object.getOwnPropertyNames(data.bpi).length; i++) {
            dataPoints.push({
                x: new Date(Object.getOwnPropertyNames(data.bpi)[i]),
                y: data.bpi[Object.getOwnPropertyNames(data.bpi)[i]]
            });
            console.log(data.bpi[Object.getOwnPropertyNames(data.bpi)[i]]);
            console.log(Object.getOwnPropertyNames(data.bpi)[i]);
        }
        
        $("#chartContainer").CanvasJSChart(options);
    
    }
    $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json?start="+startDate+"&end="+endDate, addData);
    
    }
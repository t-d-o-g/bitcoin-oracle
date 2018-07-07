window.onload = function() {
    var dataPoints = [];
    var dates = [];
    var bitcoinPrice = [];
    var startDate = '2018-06-25';
    var endDate = '2018-07-02';

    $.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", getPrice);    
    $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json?start="+startDate+"&end="+endDate, addData);
    
    function getPrice(data) {
       $("#pricedata").html(data.bpi.USD.rate_float);
    }
    
    function addData(data) {
        for (var i = 0; i < Object.getOwnPropertyNames(data.bpi).length; i++) {
            dates.push(Object.getOwnPropertyNames(data.bpi)[i]);
            bitcoinPrice.push(data.bpi[Object.getOwnPropertyNames(data.bpi)[i]]);
            dataPoints.push({
                x: new Date(Object.getOwnPropertyNames(data.bpi)[i]),
                y: data.bpi[Object.getOwnPropertyNames(data.bpi)[i]]
            });
        }
        
        new Chart(document.getElementById("line-chart"), {
            type: 'line',
            data: {
              labels: dates,
            datasets: [{ 
                data: bitcoinPrice,
                label: "BitCoin",
                borderColor: "#38fb38",
                fill: false
                }
            ]
            },
            options: {
            title: {
                display: true,
                text: 'BitCoin Historic Data'
            }
            }
        });
    }
}
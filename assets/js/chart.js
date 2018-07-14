window.onload = function() {
    var dates = [];
    var bitcoinPrice = [];
    var sentiment = [0, -.17, .06, -.28, .35, .18, -.04, .26];
    var startDate = '2018-07-06';
    var endDate = '2018-07-13';

    $.getJSON("https://api.coindesk.com/v1/bpi/currentprice.json", getPrice);    
    $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json?start="+startDate+"&end="+endDate, addData);

    function avgSent(sentArr) {
        totalSent = 0;
        for (var i = 0; i < sentArr.length; i++) {
            totalSent += sentArr[i];
        }
        return (totalSent / sentArr.length);
    }

    $('#sentimentdata').text(avgSent(sentiment));

    function getPrice(data) {
       $("#pricedata").text(data.bpi.USD.rate_float);
    }
    
    function addData(data) {
        var date = '';
        var price = '';
        for (var i = 0; i < Object.getOwnPropertyNames(data.bpi).length; i++) {
            date = Object.getOwnPropertyNames(data.bpi)[i];
            price = data.bpi[Object.getOwnPropertyNames(data.bpi)[i]]
            dates.push(date);
            bitcoinPrice.push(price);
        }
        
        var canvas = document.getElementById('line-chart');
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{ 
                    data: bitcoinPrice,
                    label: "BitCoin",
                    yAxisID: 'bitcoin',
                    borderColor: "#00c000",
                    fill: false
                }, {
                    data: sentiment,
                    label: "Sentiment",
                    yAxisID: 'sentiment',
                    borderColor: "#1155cc",
                    fill: false
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'BitCoin Historic Data'
                },
                elements: {
                    point: {
                        radius: 0
                    } 
                },
                scales: {
                    yAxes: [{
                      id: 'bitcoin',
                      type: 'linear',
                      position: 'left',
                    ticks: {
                        fontColor: '#00c000'
                    }
                    }, {
                        id: 'sentiment',
                        type: 'linear',
                        position: 'right',
                        ticks: {
                            max: 1,
                            min: -1,
                            fontColor: '#1155cc' 
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            padding: 15,
                        }
                    }]
                }
            }
        });
    }
}
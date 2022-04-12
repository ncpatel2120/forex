const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3100;
const jsonParser = bodyParser.json();
const fileName = 'currency.json';

// Load data from file
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

var prices = [];
var movingAVG=[];
var realRates =[];

app.get('/', (request, response) => {
    response.render('home');
});


function sortByValue(jsObj){
    var sortedArray = [];
    for(var i in jsObj)
    {
        // Push each JSON Object entry in array by [value, key]
        sortedArray.push([jsObj[i], i]);
    }
    return sortedArray.sort();
}

// This is a RESTful GET web service
app.get('/currency', (request, response) => {
     data.sort((a, b) => (a.day > b.day) ? 1 : -1 );
    packageData={'inputData': data, 'average':movingAVG, 'rates' : realRates};
    response.send(packageData);
});

// This is a RESTful POST web service
app.post('/currency', jsonParser, (request, response) => {
    console.log(request.body);


    data.push(request.body);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();

});

app.post('/delete', jsonParser, (request, response) => {
    id = request.body;
    data.sort((a, b) => (a.day > b.day) ? 1 : -1 );
    data.splice(id.idx, 1);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();

});






app.post('/editRate', jsonParser, (request, response) => {
    newRate = request.body;
   data.sort((a, b) => (a.day > b.day) ? 1 : -1 );
    data[newRate.rowID].rate = newRate.newRate;
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.end();

});




app.post('/queryPair', jsonParser, (request, response) => {
    movingAVG=[];
    prices = [];
    realRates=[];
   data.sort((a, b) => (a.day > b.day) ? 1 : -1 );
    var curpair = request.body;
   
    for(i=0; i<data.length; i++ ){
      if(data[i].pair === curpair.pair){
      prices.push(data[i].rate);
      realRates.push(data[i].rate);
    }
  }
  calcMovingAverage(prices);
  response.send(movingAVG);

});


function calcMovingAverage(prices){
  var n = 5;
  var sum = 0;
  var avg=0;
  for(j=0; j<realRates.length; j++ ){
    for(i =0;  i < 5;  i++){
      sum = sum + prices[i];
    }
    avg = sum / n
    movingAVG.push(avg);
    prices.splice(0, 1);
    sum = 0;
  }
  
}


console.log('server listening on port 3100');
app.listen(port);

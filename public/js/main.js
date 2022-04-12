const server = 'http://localhost:3100';
var curencypairs;
var days;
var rate;
var avg=[];
var realRates=[];

async function fetchStudents() {
    const url = server + '/currency';
    const options = {
        method: 'GET',
        headers: {
            'Accept' : 'application/json'
        }
    }
    const response = await fetch(url, options);
    const packageData = await response.json();
    exchangeRates = packageData.inputData;
    avg = packageData.average;
    realRates = packageData.rates;
    populateContent(exchangeRates, avg, realRates);

}

async function deleteRecord(id){
  const url = server + '/delete';
  const data = {idx: id};

  const options = {
      method: 'POST',
      headers: {
          'Content-Type' : 'application/json'
      },
      body: JSON.stringify(data)
  }
  const response = await fetch(url, options);
  fetchStudents();
}


async function addRate() {
    const url = server + '/currency';
    const exchangeInfo = {pair: curencypairs, day: days, rate : rate};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(exchangeInfo)
    }
    const response = await fetch(url, options);

  
}


async function editRate(id, rate) {
    const url = server + '/editRate';
    const newRate = {rowID: id, newRate: rate};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(newRate)
    }
    const response = await fetch(url, options);
}




function showForm(id){
  document.getElementById('Editform').style.visibility='visible';

  document.querySelector('#Editform').addEventListener('submit', (e) => {
      rate = document.getElementById('newRate').value;

      if (rate) {
          rate = parseFloat(rate);

          editRate(id, rate);
          fetchStudents();
          HideForm();
          reload();
      }

      e.preventDefault();
  });
}

function HideForm(){
  document.getElementById('Editform').style.visibility='hidden';
}

async function getcurrencyPair(){
    var select = document.getElementById('curencyGenpairs');
    var curreny = select.options[select.selectedIndex].text;
    getdata(curreny);

}

async function getdata(currency) {
  const url = server + '/queryPair';
  const currencyPair = {pair: currency};
  const options = {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(currencyPair)
  }
  const response = await fetch(url, options);
  const averages = await response.json();
  //alert(averages);
  avg = averages;

}







function populateContent(exchangeRates, avg, realRates) {
    var table = document.getElementById('content');
    var highest = Math.max(...realRates)+1;



    table.innerHTML = "<tr><th>Day</th><th>Currency Pair</th><th>Rate</th><th>Options</th></tr>";
    exchangeRates.forEach(function(exchangeRates, idx) {

      var row = document.createElement('tr');
      var dataId = document.createElement('td');
      var textId = document.createTextNode("day " + exchangeRates.day);

      dataId.appendChild(textId);

      var dataName = document.createElement('td');
      var textName = document.createTextNode(exchangeRates.pair);
      dataName.appendChild(textName);

      var dataRate = document.createElement('td');
      dataRate.id = 'rates'
      var textName = document.createTextNode(exchangeRates.rate);
      dataRate.appendChild(textName);


      var buttonEdit = document.createElement("button");
      buttonEdit.id = "EditBtn";
      buttonEdit.innerHTML = "Edit";
      buttonEdit.onclick = function(){showForm(idx)};

      var buttonDelete = document.createElement("button");
      buttonDelete.innerHTML = "DELETE";
      buttonDelete.onclick = function(){deleteRecord(idx)};


      row.appendChild(dataId);
      row.appendChild(dataName);
      row.appendChild(dataRate);
      row.appendChild(buttonEdit);
      row.appendChild(buttonDelete);
      table.appendChild(row);
    });



    
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      data: {
        labels: ['day1','day2','day3','day4','day5','day6'],
        datasets: [{
          type: 'line',
          label: 'MOVING AVERAGE',
          data: avg,
          backgroundColor: [
            'rgba(21, 133, 18, 0.2)' ],
            borderColor: [
              'rgba(21, 133, 18, 1)' ],
              borderWidth: 1
            },
            {
              type: 'line',
              label: 'Exchange Rates',
              data: realRates,
              backgroundColor: [
                'rgba(22, 74, 144, 0.2)' ],
                borderColor: [
                  'rgba(22, 74, 144, 1)' ],
                  borderWidth: 1
            }]
          },
          options: {
       scales: {
           y: {
               beginAtZero: true,
               suggestedMax: highest,
           }
       }
   }

        });
}


























document.querySelector('form').addEventListener('submit', (e) => {
    curencypairs = document.getElementById('curencypairs').value;
    days = document.getElementById('days').value;
    rate = document.getElementById('rate').value;

    if (rate) {
        rate = parseFloat(rate);

        addRate();
        fetchStudents();
    }
    e.preventDefault();
});

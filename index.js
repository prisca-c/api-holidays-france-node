var http = require('http');
const fs = require('fs');
var url = require('url');
var holidays = require('./data/holidays2023.json')
var departments = require('./data/departments.json')

//create a server object:
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

  let r = url.parse(req.url, true).pathname;
  let q = url.parse(req.url, true).query;

  // Holidays per season
  if (r === '/season' && q.holidays) {
    let answer = JSON.stringify(holidays[q.holidays][0]);
    res.end(answer);
  }

  // Get departments
  if (r === '/departments') {
    let answer = JSON.stringify(departments["departments"]);
    console.log(answer);
    res.end(answer);
  }

  // Know if a zone is in holiday at
  // a specific date (YYYY-MM-DD) without "-" (ex: 20230101)
  if (r === "/isholidays" && q.zone && q.date) {
    let periods = holidays;
    let zone = q.zone;
    let date = q.date;
    let bool = false;
    let season = ""

    Object.keys(periods).forEach(function(key) {
      if(date >= parseInt(periods[key][0][zone].start.replaceAll("/","")) && date <= parseInt(periods[key][0][zone].end.replaceAll("/",""))) {
        bool = true;
        season = key;
      }
    })

    res.end(JSON.stringify(bool));
  }

  if (r === '/get' && q.holidays && q.departments) {
  }
}).listen(8080); //the server object listens on port 8080
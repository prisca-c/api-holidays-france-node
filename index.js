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
  if (r === '/get' && q.holidays) {
    let answer = JSON.stringify(holidays[q.holidays]);
    res.end(answer);
  }

  // Get departments
  if (r === '/departments' && q.departments) {
    let answer = JSON.stringify(departments[q.departments]);
    console.log(answer);
    res.end(answer);
  }

  if (r === "/isholidays" && q.season && q.zone && q.date) {
    let periods = holidays[q.season][q.zone];
    let date = q.date;
    let bool = false;
    periods.forEach((period) => {
      if (parseInt(date) >= period.start && parseInt(date) <= period.end) {
        bool = true;
      }
    })
  }

  if (r === '/get' && q.holidays && q.departments) {
  }
}).listen(8080); //the server object listens on port 8080
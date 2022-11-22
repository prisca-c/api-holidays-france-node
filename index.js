var http = require('http');
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

  // Get departments by "code_dpt" or "nom"
  if (r === '/department' && q.department) {
    let getDepartments = departments["departments"];
    let result = []
    let dpts = ""
    let answer = []
    let department_search = q.department.toLowerCase();
    let periods = holidays;
    getDepartments.map((department) => {
      if (department.code_dpt === department_search || department.nom.toLowerCase() === department_search) {
        dpts = JSON.stringify(department);
        Object.keys(periods).map((key) => {
          result.push({[key]:periods[key][0][department.zone]})
        })
      }
    })
    answer = dpts + JSON.stringify(result)
    res.end(answer);
  }

  // Know if a zone is in holiday at
  // a specific zone & date (YYYY-MM-DD) without "-" (ex: 20230101)
  if (r === "/isholidays" && q.zone && q.date) {
    let periods = holidays;
    let zone = q.zone;
    let date = q.date;
    let bool = false;
    let season = ""

    Object.keys(periods).forEach(function(key) {
      if(
        date >= parseInt(periods[key][0][zone].start.replaceAll("/","")) &&
        date <= parseInt(periods[key][0][zone].end.replaceAll("/","")))
      {
        bool = true;
        season = key;
      }
    })

    res.end(JSON.stringify(bool));
  }

  // Know if a department is in holiday at
  // a specific date (YYYY-MM-DD) without "-" (ex: 20230101)
  if (r === '/isholidays' && q.department) {
    let periods = holidays;
    let getDepartments = departments["departments"];
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let getdate = q.date === "today" ? parseInt(year + "" + month + "" + day) : q.date
    console.log(getdate)
    let answer = ""
    let bool = false;
    let department_search = q.department.toLowerCase();
    getDepartments.map((department) => {
      if (department.code_dpt === department_search || department.nom.toLowerCase() === department_search) {
        answer = JSON.stringify(department);
        Object.keys(periods).forEach(key => {
          Object.keys(periods[key][0]).forEach(zone => {
            if (zone === department.zone) {
              //answer = JSON.stringify(periods[key][0][zone]);
              if(
                getdate >= parseInt(periods[key][0][zone].start.replaceAll("/","")) &&
                getdate <= parseInt(periods[key][0][zone].end.replaceAll("/",""))
              )
              {
                bool = true;
              }
            }
          })
        })
      }
    })
    res.end(JSON.stringify(bool));
  }
}).listen(8080); //the server object listens on port 8080
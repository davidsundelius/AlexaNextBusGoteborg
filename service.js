'use strict'

const xml2js = require('xml2js').parseString;
const https = require('https');

const authToken = '9045b797-7cdf-3f2f-84e5-414c584c0a8c';

var getClosestStop = function(longitude, latitude) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: 'api.vasttrafik.se',
      method: 'GET',
      path: '/bin/rest.exe/v2/location.nearbystops?originCoordLat='+longitude+'&originCoordLong='+latitude,
      headers: {
        'Authorization': 'Bearer '+authToken
      }
    };
    https.get(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        xml2js(data, function (err, result) {
          if(!result.hasOwnProperty('ams:fault')) {
            resolve(result.LocationList.StopLocation[0].$);
          } else {
            reject(result['ams:fault']['ams:description']);
          }
        });
      });
    }).on("error", (err) => {
      reject("Error: " + err.message);
    });
  });
}

var getClosestDeparture = function(stopId, date, time) {
  return new Promise(function(resolve, reject) {
    const options = {
      hostname: 'api.vasttrafik.se',
      method: 'GET',
      path: '/bin/rest.exe/v2/departureBoard?id='+stopId+'&date='+date+'&time='+time,
      headers: {
        'Authorization': 'Bearer '+authToken
      }
    };
    https.get(options, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        xml2js(data, function (err, result) {
          if(!result.hasOwnProperty('ams:fault')) {
            resolve(result.DepartureBoard.Departure[0].$);
          } else {
            reject(result['ams:fault']['ams:description']);
          }
        });
      });
    }).on("error", (err) => {
      reject("Error: " + err.message);
    });
  });
}

module.exports = {
  getNextCommute: function(longitude, latitude) {
    return new Promise(function(resolve, reject) {
      const now = new Date();
      const dateString = now.toISOString().slice(0,10).replace(/-/g,"");
      const timeString = now.getHours() + ':' + now.getMinutes();
      var result = {
        number: 'unknown',
        goal: 'unknown',
        time: timeString,
        stopName: 'unknown'
      };
      getClosestStop(longitude, latitude).then(function(stop) {
        result.stopName = stop.name;
        getClosestDeparture(stop.id, dateString, timeString).then(function(departure) {
          result.number = departure.sname;
          result.goal = departure.direction;
          result.time = departure.time;
          resolve(result);
        }).catch(function(error) {
          reject('Failed to fetch the closest departure: ' + error);
        });
      }).catch(function(error) {
        reject('Failed to fetch the closest stop: ' + error);
      });
    })
  }
}

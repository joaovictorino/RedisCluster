'use strict';

var Redis = require('ioredis');

var redis = new Redis({
    sentinels: [{ host: 'localhost', port: 26379 }, { host: 'localhost', port: 26380 }],
    name: 'dba'
  });

var geo = require('georedis').initialize(redis);

var locationSet = {
    'Toronto': {latitude: 43.6667, longitude: -79.4167},
    'Philadelphia': {latitude: 39.9523, longitude: -75.1638},
    'Palo Alto': {latitude: 37.4688, longitude: -122.1411},
    'San Francisco': {latitude: 37.7691, longitude: -122.4449},
    'St. John\'s': {latitude: 47.5500, longitude: -52.6667},
    'New York': {latitude: 40.7143, longitude: -74.0060},
    'Twillingate': {latitude: 49.6500, longitude: -54.7500},
    'Ottawa': {latitude: 45.4167, longitude: -75.7000},
    'Calgary': {latitude: 51.0833, longitude: -114.0833},
    'Mumbai': {latitude: 18.9750, longitude: 72.8258}
  };

  var count = 0;
  
  geo.addLocations(locationSet, function(err, reply){
    if(err) console.error(err)
    else console.log('added locations:', reply)
    count++;
    disconnectRedis();
  });

  geo.location('Toronto', function(err, location){
    if(err) console.error(err)
    else console.log('Location for Toronto is: ', location.latitude, location.longitude)
    count++;
    disconnectRedis();
  });

  redis.hset('datelocation', 'Toronto', new Date().toLocaleString());

  redis.hget('datelocation', 'Toronto', function(err, res){
    if(err) console.error(err)
    else console.log('Toronto is: ', res)
    count++;
    disconnectRedis();
  });

  geo.addLocation('Toronto', {latitude: 44.66678, longitude: -79.4167}, function(err, reply){
    geo.location('Toronto', function(err, location){
      if(err) console.error(err)
      else console.log('Location for Toronto is now: ', location.latitude, location.longitude)
      count++;
      disconnectRedis();
    });
  });

  var options = {
    withCoordinates: true, // Will provide coordinates with locations, default false
    withDistances: true, // Will provide distance from query, default false
    order: 'ASC', // or 'DESC' or true (same as 'ASC'), default false
    units: 'km', // or 'km', 'mi', 'ft', default 'm'
    count: 500 // Number of results to return, default undefined
  }
  
  // look for all points within ~5000m of Toronto with the options.
  geo.nearby({latitude: 43.646838, longitude: -79.403723}, 700, options, function(err, locations){
      if(err) console.error(err)
      else console.log('nearby locations:', locations)
      count++;
  });

  function disconnectRedis()
  {
    if(count == 5) redis.disconnect();
  }
'use strict';

var Redis = require('ioredis');

var redis = new Redis({
    sentinels: [{ host: 'localhost', port: 26379 }, { host: 'localhost', port: 26380 }],
    name: 'dba'
  });

function logEvery2Seconds(i) {
    setTimeout(() => {
        redis.set('foo', new Date().toLocaleString());
        redis.get('foo', function (err, result) {
            console.log(result);
        });
        logEvery2Seconds(++i);
    }, 1000)
}

logEvery2Seconds(0);

let i = 0;
setInterval(() => {
    redis.set('foo', new Date().toLocaleString());
    redis.get('foo', function (err, result) {
        console.log(result);
    });
}, 1000)
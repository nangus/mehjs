var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
 
var results = [];
var responded = 0;
 
if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
 
    Object.keys(cluster.workers).forEach(function(id) {
        cluster.workers[id].on('message', function(msg) {
            responded++;
            results.push(msg);
 
            if (responded === numCPUs) {
                cluster.workers[id].kill();
 
                var res = {
                    total_connections: 0,
                    connection_rate_per_sec: 0,
                    reply_status_1xx: 0,
                    reply_status_2xx: 0,
                    reply_status_3xx: 0,
                    reply_status_4xx: 0,
                    reply_status_5xx: 0,
                    connection_time_min: [],
                    connection_time_avg: [],
                    connection_time_max: [],
                    connection_time_median: [],
                    connection_time_stddev: []
                };
 
                // merge data
                results.forEach(function(result) {
                    Object.keys(res).forEach(function(key) {
                        var val = parseInt(result[key], 10);
                        if (Array.isArray(res[key])) {
                            res[key].push(val);
                        } else {
                            res[key] += val;
                        }
                    });
                });
 
                // average array data
                Object.keys(res).forEach(function(key) {
                    if (!Array.isArray(res[key])) return;
 
                    var total = 0;
                    res[key].forEach(function(i) {
                        total += i;
                    });
                    res[key] = total / results.length;
                });
 
                console.dir(res);
                process.exit();
            }
        });
    });
 
} else {
    var HTTPerf = require('httperfjs');
 
    var httperf = new HTTPerf({
        "server": "mervine.net",
        "verbose": true,
        "hog": true,
        "uri": "/about",
        "num-conns": 5}
    );
 
    console.log('Starting test in on pid %s.', process.pid);
    httperf.run(function (result) {
        process.send(result);
    });
}

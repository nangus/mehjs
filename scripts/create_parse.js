#!/usr/bin/env node

var parser=require('httperf').Parser;
var readFileSync = require('fs').readFileSync;

var rstub = readFileSync("data/30srp60.out").toString();


var parseme=new parser(rstub);
//parseme.connection_times=[];
console.dir(parseme.request_rate_per_sec);

#!/usr/bin/env node

var parser=require('httperfjs').Parser;
var fs    = require('fs');
var readFileSync = fs.readFileSync;
var path="/usr/local/nextgen/httperfScratch/"
var fils=fs.readdirSync(path);
console.dir(fils);
var toTest=[];
var DUR=120;
for(i in fils){
    var fil=fils[i];
    if(fil.indexOf('.out')!=-1 && fil.indexOf('srp')!=-1){
        var splits=fil.match(/([0-9]+)[a-zA-z]+([0-9]+)/);
        if(parseInt(splits[2]) == DUR ){
            toTest.push(parseInt(splits[1]));
        }
        console.log(splits[2] + " " + DUR );
        console.log(parseInt(splits[2]) == DUR );
    }
}

var significant={
    'connection_rate_per_sec':0,
    'request_rate_per_sec':0,
    'reply_status_2xx':0,
    'reply_status_5xx':0
};
var srpSPS=0;
var srpReplymedian=99999999;

var srpMedian=[];
var fastest=[];
var most=[];
var conns=0;
for(j in significant ){
    fastest[j]=0;
    most[j]=0;
}

function parseFiles(CPS){
    console.log();
    console.log('connections per second set '+CPS);
    var envs=["srp","mip","hom"];
    var parses=[];
    for(j in significant ){
        significant[j]=0;
    }
    for(var i=0; i<envs.length; i++){
        var env=envs[i];
        parses[env]=new parser(readFileSync(path+CPS+env+DUR+".out").toString());
    }
    for(i in parses){
        console.log(i+" "+parses[i].request_rate_per_sec);
        console.log(parses[i].connection_time_median);
        for(j in significant ){
            significant[j]+=parseFloat(parses[i][j]);
        }
    }
    for(j in significant ){
        if(significant[j]){
            console.log(j+"="+significant[j]);
        }
    }
    parses["srp"].request_rate_per_sec=parseFloat(parses["srp"].request_rate_per_sec);
    srpMedian.push(parseFloat(parses.srp.connection_time_median));
    if(srpSPS < parses["srp"].request_rate_per_sec && parses["srp"].reply_status_5xx === '0'){
        conns=CPS;
        srpSPS=parses["srp"].request_rate_per_sec;
        most=parses['srp'];
        most['connection_times']=0;
    }
//    parses["srp"].connection_time_median = parseFloat(parses["srp"].connection_time_median);
//    if(srpReplymedian > parses["srp"].connection_time_median){
//        srpReplymedian=parses["srp"].connection_time_median;
//        fastest=parses['srp'];
//        fastest['connection_times']=0;
//    }
}

for (i in toTest){
    parseFiles(toTest[i]);
}
console.log(srpSPS);
console.log(conns);
console.dir(most);
console.dir(srpMedian);
var bigDiff=0;
var k=0;
for(var i = 1;i<srpMedian.length;i++){
    if(bigDiff<(srpMedian[i]-srpMedian[i-1])){
        bigDiff=(srpMedian[i]-srpMedian[i-1]);
        k=i;
    }
}
console.log(srpMedian[k]+" "+srpMedian[k-1]);
//parseme.connection_times=[];
//console.dir(parseme.request_rate_per_sec);
//var srp = readFileSync("/usr/local/nextgen/httperfScratch/30srp60.out").toString();
//var mip = readFileSync("/usr/local/nextgen/httperfScratch/30mip60.out").toString();
//var hom = readFileSync("/usr/local/nextgen/httperfScratch/30hom60.out").toString();


//console.dir(parses);
//reply_status_1xx
//'command',
//'max_connect_burst_length',
//'total_connections',
//'total_requests',
//'total_replies',
//'total_test_duration',
//'connection_rate_per_sec',
//'connection_rate_ms_conn',
//'connection_time_min',
//'connection_time_avg',
//'connection_time_max',
//'connection_time_median',
//'connection_time_stddev',
//'connection_time_connect',
//'connection_length',
//'request_rate_per_sec',
//'request_rate_ms_request',
//'request_size',
//'reply_rate_min',
//'reply_rate_avg',
//'reply_rate_max',
//'reply_rate_stddev',
//'reply_rate_samples',
//'reply_time_response',
//'reply_time_transfer',
//'reply_size_header',
//'reply_size_content',
//'reply_size_footer',
//'reply_size_total',
//'reply_status_1xx',
//'reply_status_2xx',
//'reply_status_3xx',
//'reply_status_4xx',
//'reply_status_5xx',
//'cpu_time_user_sec',
//'cpu_time_system_sec',
//'cpu_time_user_pct',
//'cpu_time_system_pct',
//'cpu_time_total_pct',
//'net_io_kb_sec',
//'net_io_bps',
//'errors_total',
//'errors_client_timeout',
//'errors_socket_timeout',
//'errors_conn_refused',
//'errors_conn_reset',
//'errors_fd_unavail',
//'errors_addr_unavail',
//'errors_ftab_full',
//'errors_other',
//'connection_time_75_pct',
//'connection_time_80_pct',
//'connection_time_85_pct',
//'connection_time_90_pct',
//'connection_time_95_pct',
//'connection_time_99_pct',
//'connection_times'
//console.log(Object.keys(parses["srp"]));

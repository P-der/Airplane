const http = require('http');
const fs = require('fs');
var server = http.createServer(function(req,res){
    res.statusCode = 200;
    res.statusMessage = "success";
    res.setHeader('Content-Type','text/html')
    fs.readFile('./index.html','utf8',function(err,data){
        // console.log(data)
        res.end(data);
    })
    // var rs = fs.createReadStream('./index.html');
    // rs.on('data',function(data){
        // res.write(data);
    // })
    // rs.on('end',function(){
    //     res.end();
    // })
})
server.listen(3000)
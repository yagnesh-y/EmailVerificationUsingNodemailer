var express=require('express');
var nodemailer = require("nodemailer");
var app=express();

var smtpGmailTransport = nodemailer.createTransport("SMTP", {
  service: 'Gmail',
  auth: {
    user: 'gmail username',
    pass: 'passowrd'
  }
});
var randomNumber,Options,hostname,confirmationLink;

app.get('/',function(req,res){
	res.sendfile('index.html');
});
app.get('/send',function(req,res){
    randomNumber=Math.floor((Math.random() * 100) + 54);
	hostname=req.get('host');
	confirmationLink="http://"+req.get('host')+"/verify?id="+randomNumber;
	Options={
		to : req.query.to,
		subject : "Confirm your Email account",
		html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+confirmationLink+">Click here to verify</a>"	
	}
	console.log(Options);
	smtpGmailTransport.sendMail(Options, function(error, response){
   	 if(error){
        console.log(error);
		res.end("error");
	 }else{
        console.log("Message sent: " + response.message);
		res.end("sent");
    }
});
});

app.get('/verify',function(req,res){
	console.log(req.protocol+":/"+req.get('host'));
	if((req.protocol+"://"+req.get('host'))==("http://"+hostname))
	{
		if(req.query.id==randomNumber)
		{
			console.log("Email verified");
			res.end("<h1>Email : "+Options.to+" Successfully verified");
		}
		else
		{
			console.log("email not verified");
			res.end("<h1>Bad Request</h1>");
		}
	}
	else
	{
		res.end("<h1>Request from unknown source");
	}
});

app.listen(3000,function(){
	console.log("Express Started on Port 3000");
});

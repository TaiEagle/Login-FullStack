//const express = require('express');
//const path = require('path')
import path from 'node:path';
import express from 'express';
//const auth = require("./src/Auth");
import auth from "./src/Auth.js";



const __dirname = import.meta.dirname;
const app = express();
const port = 3000;


//Login assets
app.use(express.static(path.join(__dirname, 'dist')));
//create account assets
app.use(express.static(path.join(__dirname, 'createAccount')));
//change password assets
app.use(express.static(path.join(__dirname, 'emailPrompt')));
//one time code assets
app.use(express.static(path.join(__dirname, 'OneTimeCode')));



//allow post body to be view via json
app.use(express.json());
app.use(express.urlencoded({extended: true }));

//Login page
app.get('/Login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})






//Create account page
app.get('/CreateAccount', (req, res) =>{
  res.sendFile(path.join(__dirname, 'createAccount', 'index.html'));
  console.log("send create account html");
})


//create account request 
app.post('/CreateAccount', async (req, res) => {
  
  console.log("create account started")
  const authObj = new auth();
  let firstName = String(req.body.firstNameJson);
  let lastName = String(req.body.lastNameJson);
  let email = String(req.body.emailJson);
  let password = String(req.body.passwordJson);

  //user input validation 
  //if any of the fields are empty
  if(firstName === "" || lastName === "" || email === "" || password === ""){
    app.sendStatus(403);
    
  }
  else{

  //create new user 
  let response = await authObj.createUser(firstName, lastName, email, password);
  if(response === false){
    res.sendStatus(500);
  }
  else{
    res.redirect('/Login')
  }
  //redirect back to the login
  //res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  
  }


  

})






//Change password page
app.get('/ChangePassword', (req, res) =>{
  res.sendFile(path.join(__dirname, 'emailPrompt', 'index.html'));
})

app.post('/ChangePassword', async (req, res) =>{
  console.log("ran")
  
  let email = String(req.body.Email);

  const authObj = new auth();

  authObj.secuirtyCode();
  //console.log(email);
  //send the secuirty code to the user if the user exists
  console.log("send email")
  let sent = await authObj.sendSecuirtyCode(email);
  console.log("email sent")
  console.log(sent);
   if( sent === true){
    //send web page 
    console.log("send to new");
    res.redirect('/OneTimeCode');

   }
   else{
    //send an error code (user doesn't exist)
   }
} )


//this route handles the one time secuirty code to change a password 
app.get('/OneTimeCode', (req, res) => {
  res.sendFile(path.join(__dirname, "OneTimeCode", "index.html"));
})
app.post("/OneTimeCode", async (req, res) =>{
  console.log("start")
  //authenticate code 
  const authObj = new auth();

  try{
    //cast to int 
    console.log("parse int")
    let code = parseInt(req.body.Code);
    console.log(code)
    console.log("parse int2")
    //verify the code 
    let verified = await authObj.authenticateCode(code);
    console.log("verify")
    if(verified === true){
      console.log("verified")
      //send the code 
      //change password 
      //app.sendJson({oneTimeCode: code});
      // set to update password html 
      //app.sendFile(__dirname);
    }
    else{
       res.sendStatus(403);
    }

  }
  catch(e){

  }
  




})





//login attempt
app.post('/Login', async (req, res) => {
  console.log("executed");
  const authObj = new auth();
  //console.log(typeof(req.body.JSON_userName));
  //console.log(typeof(req.body.JSON_password));
  let authenticated = await authObj.authenticate(req.body.JSON_userName, req.body.JSON_password);
  if( authenticated === true){
    let token = authObj.createToken(req.body.JSON_userName);
    //console.log(token)
    res.send(token)
  }
  else{
    
    console.log("not authenticated")
    res.sendStatus(401);
  }




})






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
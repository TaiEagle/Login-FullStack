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




//login attempt
app.post('/Login', async (req, res) => {

  try{

  //create auth object 
  const authObj = new auth();

  //ensure user input is a string
  let Email = String(req.body.JSON_userName);
  let password = String(req.body.JSON_password);
  //authenticate user
  let authenticated = await authObj.authenticate(Email, password);
  //if the use is authenticated send jwt token 
  if( authenticated === true){
    let token = authObj.createToken(req.body.JSON_userName);
    
    res.send(token)
  }
  else{
    
    //not authenticated
    res.sendStatus(401);
  }
  }
  catch(e){
    res.sendStatus(401);
  }


})




//Create account page
app.get('/CreateAccount', (req, res) =>{
  res.sendFile(path.join(__dirname, 'createAccount', 'index.html'));
})


//create account request 
app.post('/CreateAccount', async (req, res) => {
  
  try{
  //ensure user input is a string
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
  //if use creation failed send 500 status 
  if(response === false){
    res.sendStatus(500);
  }
  //else return to the login page
  else{

    res.redirect('/Login')
  }
 
  
  }

  }
  catch(e){
    res.sendStatus(500);
  }
  

})






//Change password page
app.get('/ChangePassword', (req, res) =>{
  res.sendFile(path.join(__dirname, 'emailPrompt', 'index.html'));
})

//Change password request
app.post('/ChangePassword', async (req, res) =>{
  

  try{

  
  //ensure user input is a String
  let email = String(req.body.Email);

  const authObj = new auth();

  //send the secuirty code to the user if the user exists
  let sent = await authObj.sendSecuirtyCode(email);
  
   if( sent === true){
    //send web page 
    
    res.redirect('/OneTimeCode');

   }
   else{
    //send an error code (user doesn't exist)

   }
  }
  catch(e){

  }
} )


//this route handles the one time secuirty code to change a password 
app.get('/OneTimeCode', (req, res) => {
  res.sendFile(path.join(__dirname, "OneTimeCode", "index.html"));
})

//one time code request 
app.post("/OneTimeCode", async (req, res) =>{
  
  //authenticate code 
  const authObj = new auth();

  try{
     
    //ensure user input is a string
    let code = String(req.body.Code);
    
    
    //verify the code 
    let verified = await authObj.authenticateCode(code);
    
    if(verified === true){
      
      //send the code 
      //change password 
      //app.sendJson({oneTimeCode: code});
      //send change password page
      //app.sendFile(__dirname);
    }
    else{
      
       res.sendStatus(403);
    }

  }
  catch(e){

  }
  




})












app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
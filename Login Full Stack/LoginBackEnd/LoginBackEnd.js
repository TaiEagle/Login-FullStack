//const express = require('express');
//const path = require('path')
import path from 'node:path';
import express from 'express';
//const auth = require("./src/Auth");
import auth from "./src/Auth.js";
import cookieParser from 'cookie-parser';


const __dirname = import.meta.dirname;
const app = express();
const port = 3000;


//Login assets
app.use(express.static(path.join(__dirname, 'Login')));
//create account assets
app.use(express.static(path.join(__dirname, 'createAccount')));
//change password assets
app.use(express.static(path.join(__dirname, 'emailPrompt')));
//one time code assets
app.use(express.static(path.join(__dirname, 'OneTimeCode')));
app.use(express.static(path.join(__dirname, 'changePassword')));



//allow post body to be view via json
app.use(express.json());
app.use(express.urlencoded({extended: true }));

/*
//cookie session options
app.use(cookieSession({

  name: "session",
  maxAge: 1000 * 60 * 60 // expires after an hour
}))
  */

app.use(cookieParser());

//Login page
app.get('/Login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Login', 'index.html'));
})




//login attempt
app.post('/Login', async (req, res) => {
  console.log("login")
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
    console.log("authenticated")
    res.cookie("JWT", token, {
      //last for 1 hour 
      maxAge: 1000 * 60 * 60
    })
    res.redirect("/Home");
    
  }
  else{
    console.log("Not authenticated")
    //not authenticated
    res.sendStatus(400);
  }
  }
  catch(e){
    console.log("Not authenticated2")
    res.sendStatus(401);
  }


})




//Create account page
app.get('/CreateAccount', (req, res) =>{
  res.sendFile(path.join(__dirname, 'createAccount', 'index.html'));
})


//create account request 
app.post('/CreateAccount', async (req, res) => {
  console.log("create account")
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
  else if(response === null){
    res.sendStatus(400);
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
    
    res.cookie('email', email)
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
    let email = String(req.cookies.email)
    console.log("code:  " + code)
    console.log("email:  " + email)
    //get the email from cookie
    
    //verify the code 
    let verified = await authObj.authenticateCode(code, email);
    console.log(verified);
    
    if(verified === true){
      //let OTCJSON = {oneTimeCode: code}
      //send the code 
      //res.sendJson(OTCJSON);

      //send cookie
      res.cookie("OTP", code, {
        //last for an hour
        maxAge: 1000 * 60 * 60
      })
      //redirect to a the change password 
      console.log("redirect")
      res.redirect('/UpdatePassword')
      
    }
    else{
      
       res.sendStatus(403);
    }

  }
  catch(e){
    console.log("error")
      res.sendStatus(400);
  }
  




})





//This route changes the user password
app.get('/UpdatePassword', (req, res) => {
  res.sendFile(path.join(__dirname, 'changePassword', 'index.html'));
});
//This roud handles the change password request 
app.post('/UpdatePassword', async (req, res) =>{
    try{
      const authObj = new auth();
      //get new password
      let newPassword = String(req.body.password);
      //get OTP cookie
      let OTP = req.cookies.OTP;
      //console.log(OTP)
      //console.log(newPassword)

      //update password 
      const updated = await authObj.changePassword(newPassword, OTP);
      console.log(updated)
      if(updated === true){
        console.log("redirect")
        
        res.redirect('/Login')
        
      }
      else{
        res.sendStatus(400);
      }
  }
  catch(e){
    console.log("error")
    res.sendStatus(400);
  }

});






app.get('/Home',  (req, res) =>{
  res.sendFile(path.join(__dirname, "home.html"))
  
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
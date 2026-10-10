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
app.use(express.static(path.join(__dirname, 'changePassword')));



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
    console.log(firstName)
    console.log(lastName)
    console.log(email)
    console.log(password)
    console.log(req.body.firstNameJson)
    console.log(req.body.lastNameJson)
    console.log(req.body.emailJson)
    console.log(req.body.passwordJson)
  //create new user 
  let response = await authObj.createUser(firstName, lastName, email, password);
  console.log(response)
  }


  

})






//Change password page
app.get('/ChangePassword', (req, res) =>{
  res.sendFile(path.join(__dirname, 'changePassword', 'changePassword.html'));
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
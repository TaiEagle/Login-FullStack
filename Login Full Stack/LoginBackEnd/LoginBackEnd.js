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
app.use(express.static(path.join(__dirname, 'createAcount')));
//change password assets
app.use(express.static(path.join(__dirname, 'updatePassword')));



//allow post body to be view via json
app.use(express.json());
app.use(express.urlencoded({extended: true }));

//Login page
app.get('/Login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})






//Create account page
app.get('/createAccount', (req, res) =>{
  res.sendFile(path.join(__dirname, 'createAccount', 'index.html'));
})



//Change password page
app.get('/changePassword', (req, res) =>{
  res.sendFile(path.join(__dirname, 'changePassword', 'changePassword.html'));
})

//login attempt
app.post('/Login', async (req, res) => {
  console.log("executed");
  const authObj = new auth();
  console.log(typeof(req.body.JSON_userName));
  console.log(typeof(req.body.JSON_password));
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
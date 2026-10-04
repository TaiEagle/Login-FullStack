//const express = require('express');
//const path = require('path')
import path from 'node:path'
import express from 'express'
//const auth = require("./src/Auth");
import auth from "./src/Auth.js"

const __dirname = import.meta.dirname;
const app = express()
const port = 3000



app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.json())
app.use(express.urlencoded({extended: true }))

app.get('/Login', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

//login attempt
app.post('/Login', async (req, res) => {
  console.log("executed")
  const authObj = new auth();
  console.log(typeof(req.body.JSON_userName));
  console.log(typeof(req.body.JSON_password));
  let authenticated = await authObj.authenticate(req.body.JSON_userName, req.body.JSON_password)
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
  console.log(`Example app listening on port ${port}`)
})
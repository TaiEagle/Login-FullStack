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

//Not tested
app.post('/Login', (req, res) => {
  console.log("executed")
  const authObj = new auth();
  console.log(req.body.JSON_userName);
  let token = authObj.createToken(req.body.JSON_userName);

  res.send(token)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
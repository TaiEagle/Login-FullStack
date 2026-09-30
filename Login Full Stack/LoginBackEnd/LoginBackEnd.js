const express = require('express');
const path = require('path')

const auth = require("./src/Auth");

const app = express()
const port = 3000



app.use(express.static(path.join(__dirname, 'dist')))

app.get('/Login', (req, res) => {
  res.sendFile(pzth.join(__dirname, 'dist', 'index.html'))
})

//Not tested
app.post('/Login', (req, res) => {
  const authObj = new auth();

  authObj.createToken(req.userName);

  res.send(token)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
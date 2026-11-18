import Auth from '../src/Auth.js'
import DB from '../src/Database_Driver.js'
import QUnit from 'qunit'
import {OTP} from 'otplib'
import { generateSecret, generate, verify, generateURI } from "otplib";
//const Auth = require('../src/Auth.js')
//const DB = require('../src/Database_Driver.js')
//const QUnit = require('qunit');
//import QUnit from 'qunit';

const {module, test} = QUnit;

QUnit.module('Login');

QUnit.test('test Test', (assert) =>{
    let x = 7;
    let y = 7;
    assert.equal(x, y);
})


QUnit.test('Add user', async (assert) => {
    let dbDriver = new DB();

    let exists = await dbDriver.userExists("userName");
    


    //check that the user does not exist
    assert.equal(exists, false);

    //add user name
    let authObj = new Auth();
    let writeSuccess = await authObj.createUser("testName", "testLastName", "testEmail@email.email", "SuperSecretPassword");

    
    //check that the user does exist
    assert.equal(writeSuccess, true);


    await dbDriver.deleteUser("testEmail@email.email");



});


QUnit.test('Authenticate user', async (assert) => {
    let authObj = new Auth();

    let userName = "userNameAuthTEST";
    let password = "password123";
    let athenticate = await authObj.authenticate(userName, password);
    

    assert.equal(athenticate, true);
})

QUnit.test('Authenticate with bad password', async (assert) =>{
    let authObj = new Auth();

    let userName = "userNameAuthTEST";
    let password = "wrong passWord";
    let athenticate = await authObj.authenticate(userName, password);
    

    assert.equal(athenticate, false);
})

QUnit.test('JWT testing', (assert =>{

    let authObj = new Auth();
    
    const userToken = authObj.createToken("userName1", "client");

    const [decoded, name] = authObj.verifyToken(userToken, "userName1");
    //console.log(decoded);

    assert.equal(decoded, true);

}))

QUnit.test('JWT testing bad token string', (assert =>{

    let authObj = new Auth();
    
    const userToken = authObj.createToken("userName1", "client");

    //console.log(userToken);
    const wrongToken = "50IiwiaWF0IjoxNzkwNzUJleHAiOjE3OTA3NTU5NTJ9.wR0tfAe1FwhqoXKHxU1ulW0B_JssxRKFFczIp1A"

    const [decoded, name] = authObj.verifyToken(wrongToken, "userName1");
    //console.log(decoded);

    assert.equal(decoded, false);

}))

QUnit.test('JWT testing bad name payload', (assert =>{

    let authObj = new Auth();
    
    const userToken1 = authObj.createToken("userName1", "client");
    const userToken2 = authObj.createToken("userName2", "client");

    const [decoded, name] = authObj.verifyToken(userToken2, "userName1");
    //console.log(decoded);

    assert.equal(decoded, false);
    assert.equal(name, null);
    

}))



QUnit.test('One Time Code2', async (assert) =>{
    const otp = new OTP();
    

    //create secret
    const secret = otp.generateSecret();
 
    //generate the code 
    const token = await otp.generate({secret});
  

    const verify = await otp.verify({secret, token});

    assert.equal(verify.valid, true);



})


QUnit.test('OneTimeCode3', async  (assert) => {


    //create secret
    const secret = generateSecret();
   
    //create code 
    const token = await generate({secret});
 

    const result = await verify({secret, token});
    


    assert.equal(result.valid, true);


})

QUnit.test('Email Regex test', (assert) =>{
    var str = "not email";
    var str2 = "email@gmail.com";

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailCheck = regex.test(str);
    const emailCheck2 = regex.test(str2);
    assert.equal(emailCheck, false);
    assert.equal(emailCheck2, true);
})
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


QUnit.test('OTP right code', async (assert) =>{
    const authObj = new Auth();

    
   
    const email = "userNameAuthTEST"
    //get one time password
    const OTP = await authObj.secuirtyCode(email);
    
    const authenticated = await authObj.authenticateCode(OTP, email);

    assert.equal(authenticated, true);



})

QUnit.test('OTP Wrong code', async (assert) =>{
    const authObj = new Auth();


    const email = "userNameAuthTEST"
    //get one time password
    const OTP = await authObj.secuirtyCode(email);
    const wrongOTP = OTP + 1;

    const authenticated = await authObj.authenticateCode(wrongOTP, email);

    assert.equal(authenticated, false);

    const authenticatedRight = await authObj.authenticateCode(OTP, email);

    assert.equal(authenticatedRight, true);




})


//currently doesn't run because it takes 31 seconds to run --- no fun to wait :(
QUnit.test.skip('OTP time expire', async (assert) =>{
    const authObj = new Auth();


    const email = "userNameAuthTEST"
    //get one time password
    const OTP = await authObj.secuirtyCode(email);
    

    //wait for 31 seconds 
    const startTime = Date.now();
    let repeat = true
    while(repeat){
        //if 31 seconds pass
        if(( Date.now()  - startTime  ) >= 29000  ){
            repeat = false;
        }
        else{
            //do nothing 
        }
    }
    const authenticated = await authObj.authenticateCode(OTP);

    assert.equal(authenticated, true);



});


QUnit.test.skip('OTP time test', async (assert) =>{
    const authObj = new Auth();

    
   
    const email = "userNameAuthTEST"
    //get one time password
    const OTP = await authObj.secuirtyCode(email);

    let seconds = 1000;
    
        //wait for 25 seconds 
    const startTime = Date.now();
    let repeat = true
    while(repeat){
        ;
        //if it is equal to or greater than seconds 
        if( Date.now()  - startTime   >= seconds){
            //add 1000 to seconds 
            console.log("seconds:  " + seconds)
            seconds = seconds + 1000;
            let authenticated = await authObj.authenticateCode(OTP, email)
            if(authenticated === false){
            repeat = false;
            console.log("seconds fulfiled:  " + seconds)
            console.log("authenticated: " + authenticated)
            }

            
        }
        else{
            //do nothing 
        }
    }
    
    const authenticated = await authObj.authenticateCode(OTP, email)
    assert.equal(authenticated, false);



})




QUnit.test('UpdatePassword', async (assert) =>{
    const authObj = new Auth();

    //get code
    const email = "userNameAuthTEST"
    //get one time password
    const OTP = await authObj.secuirtyCode(email);


    //authenticate OTP 
    await authObj.authenticateCode(OTP, email);

 

    //change current password
    const newPassword = "password1234"
    await authObj.changePassword(newPassword, OTP);

    //authenticate user
    let userName = "userNameAuthTEST";
    
    let athenticate = await authObj.authenticate(userName, newPassword);
    
    console.log("auth1  " + athenticate)
    assert.equal(athenticate, true);



    //authenticate with old password
    const oldPassword = "password123"
    let athenticate2 = await authObj.authenticate(userName, oldPassword);
    
    console.log("auth2  " + athenticate2)
    assert.equal(athenticate2, false );



    
    //reset to old password and authenticate 
    let resetPassword = "password123";
    await authObj.changePassword(resetPassword, OTP);
    
    let athenticate3 = await authObj.authenticate(userName, resetPassword);
    console.log("auth3  " + athenticate3)

    assert.equal(athenticate3, true );


})





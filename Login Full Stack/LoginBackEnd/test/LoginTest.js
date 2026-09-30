import Auth from '../src/Auth.js'
import DB from '../src/Database_Driver.js'
import QUnit from 'qunit'
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
    let writeSuccess = await authObj.createUser("userName", "password123");

    
    //check that the user does exist
    assert.equal(writeSuccess, true);


    await dbDriver.deleteUser("userName");



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
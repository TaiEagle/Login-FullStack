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
    //console.log("yoyoyo");
    //console.log(exists);
    //check that the user does not exist
    assert.equal(exists, false);

    //add user name
    let authObj = new Auth();
    let writeSuccess = await authObj.createUser("userName", "password");

    //let existsNow = await dbDriver.userExists("userName");
    //console.log("yoyoya");
    //console.log(writeSuccess);
    //check that the user does exist
    assert.equal(writeSuccess, true);



});


QUnit.test('Authenticate user', async (assert) => {
    let authObj = new Auth();
    let writeSuccess = await authObj.createUser("userNameAuthenticateTest", "password");

    assert.equals();
})
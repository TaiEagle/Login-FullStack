//import Auth from '../src/Auth.js'
//import DB from '../src//Database_Driver.js'
//import QUnit from 'qunit'
const Auth = require('../src/Auth.js')
const DB = require('../src/Database_Driver.js')
const QUnit = require('qunit');
//import QUnit from 'qunit';

QUnit.module('Login');

QUnit.test('test Test', function(assert) {
    let x = 7;
    let y = 7;
    assert.equal(x, y);
})

/*
QUnit.test('Add user', async  function(assert) => {
    const dbDriver = new DB();

    const exists = dbDriver.userExists("userName");

    //check that the user does not exist
    assert.equal(exists, false);

    //add user name
    const authObj = new Auth();
    authObj.createUser("userName", "password");

    exists = dbDriver.userExists("userName");
    //check that the user does exist
    assert.equal(exists, true);



});
*/

QUnit.test('Test with async-await', async function (assert) {
     const dbDriver = new DB();

    const exists = dbDriver.userExists("userName");

    //check that the user does not exist
    assert.equal(exists, false);

    //add user name
    const authObj = new Auth();
    authObj.createUser("userName", "password");

    exists = dbDriver.userExists("userName");
    //check that the user does exist
    assert.equal(exists, true);
});
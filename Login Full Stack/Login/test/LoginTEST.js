//import Auth from '../src/Auth.js'
//import DB from '../src//Database_Driver.js'

const auth = require('../src/Auth.js')
const db = require('../src//Database_Driver.js')


Qunit.module('Login');

Qunit.test('Add user', async  () => {
    const dbDriver = new DB();

    exists = dbDriver.userExists("userName");

    //check that the user does not exist
    assert.equal(exists, false);

    //add user name
    const authObj = new Auth();
    authObj.createUser("userName", "password");

    exists = dbDriver.userExists("userName");
    //check that the user does exist
    assert.equal(exists, true);



})
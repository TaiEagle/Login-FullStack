import Auth from '../Auth'
import DB from '../Database_Driver'



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


    //delete the user from the databse 
    authObj.deleteUser("userName");


    exists = dbDriver.userExists("userName");
    //check that the user does not exist
    assert.equal(exists, false);



})
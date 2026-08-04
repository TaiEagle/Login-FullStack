import {insertNewUser} from DB;


export default class Auth{

    constructor(){

    }



    //This method creates a user. Taking in user input, a user name and password is added
    //to the database 
    createUser(userName, Password){


        //create object to put into database
        const user = {"userName": userName, "password": Password}

        insertNewUser(user);
    }
}
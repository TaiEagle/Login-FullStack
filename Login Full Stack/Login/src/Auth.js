import DB from "./Database_Driver.js";


export default class Auth{

    constructor(){

    }



    //This method creates a user. Taking in user input, a user name and password is added
    //to the database 
    createUser(userName, Password){

        const DB_Driver = new DB();
        //create object to put into database
        const user = {"userName": userName, "password": Password}

        DB_Driver.insertNewUser(user);
    }
}
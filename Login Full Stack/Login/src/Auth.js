import DB from "./Database_Driver.js";


export default class Auth{

    constructor(){

    }



    //This method creates a user. Taking in user input, a user name and password is added
    //to the database 
    async createUser(userName, Password){
        //console.log("execute 3");
        const DB_Driver = await new DB();
        //create object to put into database
        const user = {"userName": userName, "password": Password}
        //console.log("execute 4");
        DB_Driver.insertNewUser(user);
        //console.log("execute 5");
    }
}
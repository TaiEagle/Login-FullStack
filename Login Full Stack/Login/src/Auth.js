import DB from "./Database_Driver.js";
import argon2 from "argon2";

export default class Auth{

    constructor(){
        
    }



    //This method creates a user. Taking in user input, a user name and password is added
    //to the database 
    async createUser(userName, Password){
        //console.log("execute 3");
        const DB_Driver = await new DB();

        
        //hash and salt password
        try{
            const hash = await argon2.hash("password")
            const user = {"userName": userName, "password": hash} 
            let driverSucess = await DB_Driver.insertNewUser(user);

            if( await driverSucess == true){
            //console.log(driverSucess)
            //console.log("reutnred true")
            return true;
            }
            else{
                //console.log(driverSucess)
                //console.log("reutnred false")
                return false;
            }
        }
        catch(error){

        }


        //create object to put into database
        //const user = {"userName": userName, "password": hash}
        //console.log("execute 4");

        
        //console.log(driverSucess)

        //console.log("execute 5");
    }


    /*
    //This method authenticates a user 
    */
   async authenticate(userName, passWord){

        let DB_Driver = await new DB();
        //create object to put into database
        
        let user = await DB_Driver.getUser(userName);

        //console.log(user);

        //authenticate user 
        try{
            if(await argon2.verify(user.password, passWord)){
                console.log("reutrned true")
                return true;
            }
            else{
                console.log("reutrned false")
                return false;
            }
        }
        catch(error){
            return false;
        }

/*
        if(user.password == passWord){
            return true;
        }
        else{
            return false;
        }
            */
   }

    async deleteUser(userName){
        const DB_Driver = await new DB();
        await DB_Driver.deleteUser(userName);
    }
}
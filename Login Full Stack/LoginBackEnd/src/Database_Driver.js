import {MongoClient} from "mongodb";
//const {MongoClient} = require("mongodb")


export default class DB {
//class DB {
    constructor(){
        try{
        //connect to database
        this.client = new MongoClient("mongodb://localhost:27017");
        
        this.client.connect();
        }
        catch(e){

        }
        
    }




        /*
        This method determines if a username exists in the databse 
        Parameter 1: email --- String

        Returns a boolean
        */
    async userExists(email){
        


        try{
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");
        }
        catch(e){
            return false;
        }

        

        //query the database to determine is a document exists with that email 
        try{
            if(await myColl.findOne({"email": String(email)}) != null ){
            //user found
            return true;
        }
        else{
            //user does not exist
            return false;
        }}
        
        catch(e){
            //user does not exits 
            return false;
        }
    }



    /*
    This method inserts new user account in the database
    Parameter 1: docs --- JSON

    returns a boolean 
    */
    async insertNewUser(docs){
        try{
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        //check if the user does not exist
        if(await this.userExists(docs.email) == false){

            //insert document into the databse 
            const result = await myColl.insertOne({ "firstName": String(docs.firstName), "lastName": String(docs.lastName), "email": String(docs.email), "password": String(docs.password)  });

            
           //if the insert was successful return true 
            if(result.acknowledged == true){
               
                return true;
            }
            //was not successful
            else{
                
                return false;
            }
        }
        //if the user already exists don't create new user
        else{
            return false;
        }
    }
    catch(e){
        return false;
    }


    }


    /*
    This method returns a user object
    Parameter 1: email --- String 
    returns a JSON object or false if an error occured 
    */
    async getUser(email){
        try{

        
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        return await myColl.findOne({"email": String(email)});
        }
        catch(e){
            return false;
        }
    }

    /*
    //This method deletes a user 
    Parameter 1: email --- String
    returns nothing or false if an error occured 
    */
    async deleteUser(email){
        try{
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        await myColl.deleteOne({"email": String(email)});
        }
        catch(e){
            return false;
        }
    
    }


    /*
    This inserts a one time code with an email into the database 
    Parameter 1: email --- String
    Parameter 2: code --- String
    returns nothing
    */
    async InsertOneTimeCode(Email, code){
        try{
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("ChangePasswordMFA");

        await myColl.insertOne({email: Email, passcode: code}, { expiresAt: 5* 60 * 1000} );
        }
        catch(e){

        }

    }

    /*
    This method gets a secret from the database to generate a one time code
    returns a String
    */
    async getSecret(){
        try{
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("ChangePasswordMFA");

        return await myColl.findOne({name: "secret"})
        }
        catch(e){

        }

    }


}
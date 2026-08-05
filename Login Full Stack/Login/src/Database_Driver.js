import {MongoClient} from "mongodb";



export default class DB {
    constructor(){
        //connect to database
        this.client = new MongoClient("mongodb://localhost:27017");
        //await client.connect();
        this.client.connect();
    }




        //This method determines if a username exists in the databse 
    userExists(userName){
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        

        const query = {"userName": userName};
        if(myColl.countDocuments(query) === 0){
            return false;
        }
        else{
            return true;
        }
    }



    //This method inserts new user account in the database
    insertNewUser(docs){
        //check if userName exists

        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        //if the user does not exist
        if(!this.userExists(docs.userName)){
            //insert document into the databse 
            const result = myColl.insertOne(docs);
        }
        //don't create new user
        else{
            return;
        }


    }



}
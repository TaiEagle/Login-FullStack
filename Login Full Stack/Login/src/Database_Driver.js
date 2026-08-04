import {MongoClient} from "mongodb";



export default class DB {
    constructor(){
        //connect to database
        const client = new MongoClient("mongodb://localhost:27017");
        await client.connect();
    }

    //This method inserts new user account in the database
    insertNewUser(obj){
        //check if userName exists

        //connect to database
        const myDB = client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        //if the user does not exist
        if(!userExists(userName)){
            //insert document into the databse 
            const result = await myColl.insertOne(obj);
        }
        //don't create new user
        else{
            return;
        }


    }

    //This method determines if a username exists in the databse 
    userExists(userName){
        //connect to database
        const myDB = client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        

        const query = {"userName": userName};
        if(await myColl.countDocuments(query) === 0){
            return false;
        }
        else{
            return true;
        }
    }

}
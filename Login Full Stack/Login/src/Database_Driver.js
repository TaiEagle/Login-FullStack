import {MongoClient} from "mongodb";



export default class DB {
    constructor(){
        //connect to database
        this.client = new MongoClient("mongodb://localhost:27017");
        //await client.connect();
        //console.log("execute 6");
        this.client.connect();
        //console.log("execute 7");
    }




        //This method determines if a username exists in the databse 
    async userExists(userName){
        //console.log("execute 8");
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        //console.log("execute 9");

        const query = {"userName": userName};
        if(await myColl.countDocuments(query) > 0){
            //console.log("returned false")
            return false;
        }
        else{
            return true;
        }
    }



    //This method inserts new user account in the database
    async insertNewUser(docs){
        //check if userName exists
        //console.log("execute 88");
        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        //console.log("execute 99");
        //if the user does not exist
        if(this.userExists(docs.userName)){
            //insert document into the databse 
            const result = myColl.insertOne(docs);
            console.log("Inserted");
            const documents = await myColl.find({}).toArray();
            for(let i = 0; i < await myColl.countDocuments({}); i++){
                console.log(documents[i])
            }
        }
        //don't create new user
        else{
            return;
        }


    }



}
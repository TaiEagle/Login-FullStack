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

        //const query = {"userName": userName}; don't use
        //if the number of documents is greater than 0 (it exists)
        //if(await myColl.countDocuments({"userName": String(userName)}) > 0){

        //console.log(await myColl.findOne({"userName": userName}))

        if(await myColl.findOne({"userName": String(userName)}) != null ){
            //console.log("returned true")
            return true;
        }
        else{
            //console.log("returned false")
            return false;
        }
    }



    //This method inserts new user account in the database
    //Parameter 1: JSON --- docs
    //returns nothing 
    async insertNewUser(docs){
        //check if userName exists

        //console.log("execute 88");

        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        //console.log("execute 99");
        //if the user does not exist
        
        if(await this.userExists(docs.userName) == false){
            //insert document into the databse 
            //console.log("exectued");
            //TODO:: change password parameter
            const result = myColl.insertOne({"userName": String(docs.userName), "password": String(docs.password)  });

            console.log(typeof(result));
            //console.log(myColl.insertOne({"userName": String(docs.userName), "password": String(docs.password)  }))
            if(await result.userName == docs.userName){
                //console.log(result);
                console.log("returned true");
                return true;
            }
            else{
                //console.log(result);
                console.log("returned false");
                return false;
            }
            //testing
            const documents = await myColl.find({}).toArray();
            for(let i = 0; i < await myColl.countDocuments({}); i++){
                //console.log(documents[i])
            }

            //testing
        }
        //don't create new user
        else{
            return false;
        }


    }


    async deleteUser(userName){

        //connect to database
        const myDB = this.client.db("userAccount");
        //connect to collection
        const myColl = myDB.collection("AuthCredentials");

        await myColl.deleteOne({"userName": String(userName)});
    
    }

}
import {MongoClient} from "mongodb";



class DB {
    constructor(){
        //connect to database
        const client = new MongoClient("mongodb://localhost:27017");
        await client.connect();
    }
}
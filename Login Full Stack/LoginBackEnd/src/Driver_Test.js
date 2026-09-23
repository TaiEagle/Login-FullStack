import Auth from "./Auth.js";


async function testing(){
    console.log("execute 1");
    const authObj = new Auth();


    console.log("execute 1");
    //await authObj.createUser("yo It fucking worked Yo", "yoyoyoPasswordYO");

    await authObj.deleteUser("yo It fucking worked Yo");
    console.log("execute 2");
}

testing();
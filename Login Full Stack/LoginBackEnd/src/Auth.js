import DB from "./Database_Driver.js";
//const DB = require("./Database_Driver.js")
import argon2 from "argon2";
//const argon2 = require("argon2")
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import {OTP} from 'otplib'


export default class Auth{
//class Auth{
    constructor(){
        
    }



    //This method creates a user. Taking in user input, a user name and password is added
    //to the database 
    async createUser(firstName, lastName, email, password){
        //console.log("execute 3");
        const DB_Driver = await new DB();

        
        //hash and salt password
        try{
            
            //ensure user input is a string 
            let firstNameStr = String(firstName);
            let lastNameStr = String(lastName);
            let emailStr = String(email);
            let passwordStr = String(password);

            //create password hash
            const hash = await argon2.hash(passwordStr)
            const user = {"firstName": firstNameStr, "lastName": lastNameStr, "email": email, "password": hash} ;

            if(await DB_Driver.userExists(emailStr) === false){

                let driverSucess = await DB_Driver.insertNewUser(user);
                
            }
            else{
                
                return false;
            }
            

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
                //console.log("reutrned true")
                //if the password is true, send a token
                const token = this.createToken(userName)
                return true;
            }
            else{
                //console.log("reutrned false")
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


    //This method creates a JWT to send the user 
    

    createToken(userName){
        const token = jwt.sign({name: userName}, "5^jf8eIxF", {expiresIn: "1h"});
        return token;
    }

    //This method verifies a token from user input
    verifyToken(userToken, userName){
        
        

    
        //decode the token 
        try{
            //ensure it is a string
            let token = String(userToken);
            //verify the token
            let decoded = jwt.verify(token, "5^jf8eIxF");
            //console.log(decoded.name);
            if(decoded.name === userName){
                return [true, decoded.name];
            }
            throw new error("wrong userName in token");
        }
        catch(e){
            //console.log(e);
            return [false, null];
        }

    }



    //This method produces a one time security code to change the password
    async secuirtyCode(){
        const otp = new OTP();
        //create secret
        //const secret = otp.generateSecret();
        const DB_Driver = new DB();
        let secretObj = await DB_Driver.getSecret();
        let secret = secretObj.secret;

        console.log("secret: " + secret);
        //create code 
        const token = await otp.generate({secret})

        //console.log("Token: " + token);
        return token;

    }



    //This method checks if a email exists and send a one time security code to the email
    async sendSecuirtyCode(email){


        
        dotenv.config()
        const DB_Driver = new DB();
        
        if(await DB_Driver.userExists(email) === true){
            //create secuirty code
            //let code = this.secuirtyCode()
            
            //send the email
       
            
            // Create a transporter using SMTP
            
            const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
            auth: {
                user: process.env.emailstring,
                pass: process.env.pwd,
            },
            tls: {
                rejectUnauthorized: false
            }
            });

        
            //create one time secuirty code 
            let oneTimeCode = await this.secuirtyCode();
            let emailText = "Your one time code is: " + oneTimeCode;
            //add it to the database 
            await DB_Driver.InsertOneTimeCode(email, oneTimeCode);

            // send the msg
            try {
                const info = await transporter.sendMail({
                    from: process.env.emailstring, // sender address
                    to: email, // list of recipients
                    subject: "One time secuirty code", // subject line
                    text: emailText, // plain text body
                    
                });

                //console.log("Message sent: %s", info.messageId);
                // Preview URL is only available when using an Ethereal test account
                //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                
                return true;
            } catch (err) {
                console.error("Error while sending mail:", err);
                }
               


        }
        else{
            console.log("false")
            return false; 
        }


    }



    //This method authenticatets the one time code 
    async authenticateCode(code){
        try{
        
        const otp = new OTP();
        const DB_Driver = new DB();
        
        let secretObj = await DB_Driver.getSecret();
        let secretString = secretObj.oneTimeCodeSecret;

        let secret = Uint8Array.from(secretString)
        console.log(secret)
        let verify = await otp.verify({secret, code});
        console.log("after verify")
        console.log(typeof(verify))
        console.log(verify.valid)
        if(verify.valid === true){
            console.log("true")
            return true;
        }
        else{
            console.log("false1")
            return false;
        }
    
    }
    catch(e){
        console.error(e)
        return false;
    }




}


    //This method changes the password
    changePassword(){

        
    }









}
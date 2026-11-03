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



    /* This method creates a user. Taking in user input, a user name and password is added
    //to the database 

    Parameter 1: firstName --- String
    Parameter 2: lastName --- String
    Parameter 3: email --- String 
    Parameter 4: password --- String 

    Returns a boolean --- true if the user was created, false if the user was not created succesfully


    */
    
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
            //Create JSON object to store in the database 
            const user = {"firstName": firstNameStr, "lastName": lastNameStr, "email": email, "password": hash} ;

            //If the user does not exist 
            if(await DB_Driver.userExists(emailStr) === false){
                //insert account details 
                let driverSucess = await DB_Driver.insertNewUser(user);

                //if the database insertion was successful retun true 
                if( await driverSucess == true){
            
                    return true;
                    }
                //If it was not succesful return false.
                else{
                    
                        return false;
                    }
                
            }
            //If the user does exist don't create the account
            else{
                
                return false;
            }
            


        }
        catch(error){
            return false;
        }


        
    }


    /*
    //This method authenticates a user 

    Parameter 1: userName --- String
    Parameter 2: password --- String 

    Returns a boolean --- true indicates the user is authenticated, flase indicates the user is not authenticated 
    */
   async authenticate(userName, passWord){

        //Data base driver object 
        let DB_Driver = await new DB();

        //get the user account information 
        let user = await DB_Driver.getUser(userName);

        

        //authenticate user 
        try{
            //If the hashed password matches the stored hashed password
            if(await argon2.verify(user.password, passWord)){
                
                //if the password is true, send a token
                //#TODO send token 
                const token = this.createToken(userName)
                return true;
            }
            //Not authenticated
            else{
                
                return false;
            }
        }
        catch(error){
            return false;
        }


   }


   /*
   This method is used ot delete a user from the database
   Parameter 1: userName --- String 
   */
    async deleteUser(userName){
        
        const DB_Driver = await new DB();
        //Delete user
        await DB_Driver.deleteUser(userName);
    }

    /*
    This method creates a JWT to send the user 
    Parameter 1: userName --- String 

    returns a string that contains the token 
    */
    createToken(userName){
        //create token
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
        let secret = secretObj.oneTimeCodeSecret;

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
    async authenticateCode(token){
        try{
        
        const otp = new OTP();
        const DB_Driver = new DB();
        
        //Get secret
        let secretObj = await DB_Driver.getSecret();
        let secret = secretObj.oneTimeCodeSecret;

        //let secret = Uint8Array.from(secretString)
        //console.log(secret)
        let verify = await otp.verify({secret, token});
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
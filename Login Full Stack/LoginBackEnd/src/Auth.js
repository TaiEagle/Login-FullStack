import DB from "./Database_Driver.js";
//const DB = require("./Database_Driver.js")
import argon2 from "argon2";
//const argon2 = require("argon2")
import jwt from "jsonwebtoken";
const { sign, verify } = jwt;
import nodemailer from "nodemailer"
import dotenv from "dotenv"
import {OTP} from 'otplib'
import speakeasy from 'speakeasy'


export default class Auth{
//class Auth{
    constructor(){
        
    }


    /*
    This method hashes a password
    Parameter 1: password --- String
    returns a string

    */

    async hashPassword(password){
        return await argon2.hash(password);
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
        
  

        
        //hash and salt password
        try{
            const DB_Driver = await new DB();
            //ensure user input is a string 
            let firstNameStr = String(firstName);
            let lastNameStr = String(lastName);
            let emailStr = String(email);
            let passwordStr = String(password);

            //check that the email is the right format 
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            //const emailCheck = regex.test(emailStr);
            let emailCheck = true
            if(emailCheck === true){
                //continue
            }
            else{
                return null;
            }

            //create password hash
            //const hash = await argon2.hash(passwordStr)
            const hash = await this.hashPassword(passwordStr);

            //generate secret 
            const secret = this.generateSecret().base32;
            let counter = 0;
            //Create JSON object to store in the database 
            const user = {"firstName": firstNameStr, "lastName": lastNameStr, "email": emailStr, "password": hash, "secret": secret, "count": counter} ;

            
            
                //insert account details 
            let driverSucess = await DB_Driver.insertNewUser(user);

            //if the database insertion was successful retun true 
            if(driverSucess === true){
            
                return true;
                }
            
            //If it was not succesful return false.
            else{
                    
                    return false;
                }
                
            
            //If the user does exist don't create the account
            
            


        }
        catch(error){
            console.log(e)
            console.log("error")
           
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



        

        //authenticate user 
        try{

            //Data base driver object 
            let DB_Driver = await new DB();

            //get the user account information 
            let user = await DB_Driver.getUser(userName);
            //#TODO if use does not exist return false
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



    /*
    This method verifies a token from user input
    Parameter 1: userToken --- String
    Parameter 2: userName --- String 

    returns a list containing a boolean in slot 0 determining if it was verified or not and the String userName embedded in the token in slot 1 
    */
    verifyToken(userToken, userName){
        
        

    
        //decode the token 
        try{
            //ensure it is a string
            let token = String(userToken);
            //verify the token
            let decoded = jwt.verify(token, "5^jf8eIxF");
            //if the user name provided matches the user name used to login 
            if(decoded.name === userName){
                //return true and the user name
                return [true, decoded.name];
            }
            //the wrong userName was provided 
            else{
                
                throw new error("wrong userName in token");
            }
            
        }
        catch(e){
            
            return [false, null];
        }

    }

    /*
    This method generates a secrete for a new user 
    returns a String
    */
   generateSecret(){
    const secret = speakeasy.generateSecret();
    return secret;
   }

   


    /*
    This method produces a one time security code to change the password

    returns the one time code as a string 
    */
    async secuirtyCode(email){
         const DB_Driver = new DB();

         let counter = 0;
        //check that there is not an abundance of OTP for a user in the database at a given time to protect agaisnt DOS attack 
        const OTPObjExists = await DB_Driver.getOTPObjEmail(email);
        //if an object exists 
        if(OTPObjExists != false){
            //update counter 
            counter = await OTPObjExists.counter + 1
            //delete the current object instance 
            
            //if more than 100 OTP have been created within 5 minutes, dont't create another 
            if(counter > 100){
                return false;
            }
            else{
                await DB_Driver.deleteOTPObject(email);
            }
        }
        //get secret 
       
        //get users secret 
        const secret = await DB_Driver.getSecret(email);
        
        
        //create one time code 
        //const token = await otp.generate({secret})

        //get counter number
        const userCounter = await DB_Driver.getCounter(email);
        // Get a counter-based token
        const token = speakeasy.hotp({
        secret: secret,
        encoding: 'base32',
        counter: userCounter
        });


        //insert into database
        const inserted = await DB_Driver.InsertOneTimeCode(email, token, counter)
        //if insert fails return false otherwise return token 
        if(inserted === false ){
            return false;
        }
        else{
            return token;
        }
        
        

    }



    /*
    //This method checks if a email exists and send a one time security code to the email

    Parameter 1: email

    returns a boolean 
    */
    async sendSecuirtyCode(email){


        //use .env file for private information 
        dotenv.config()
        const DB_Driver = new DB();
        
        const userExists = await DB_Driver.userExists(email);
        //check if the user exists
        if( userExists === true){
            
            
            
       
            
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
            let oneTimeCode = await this.secuirtyCode(email);
            if(oneTimeCode === false){
                return false;
            }
            //text to be sent via email
            let emailText = "Your one time code is: " + oneTimeCode;
        
            

            // send the email
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
                //console.error("Error while sending mail:", err);
                }
               


        }
        else if(userExists === null){
            return false;
        }
        else{
            
            return false; 
        }


    }


    /*
    //This method authenticatets the one time code 
    Parameter 1: token 

    returns a boolean 
    */
    async authenticateCode(tokenStr, email){
        try{
        
        //const otp = new OTP();
        const DB_Driver = new DB();
        
        //Get secret
        let secret = await DB_Driver.getSecret(email);
        //let secret = secretObj.secret;
        
        //get OTP object from the database 
        const OTPObj = await DB_Driver.getOTPObj(tokenStr);
        //console.log("OTP object email:  " + OTPObj.email + "  OTP code:  " + OTPObj.passcode + "  secret:  " + secret)
        
        //if it does not exist 
        if(OTPObj === false){
            return false;
        }

        const counter = await DB_Driver.getCounter(email);
        //console.log("counter:  " + counter + " Type: " + typeof(counter))
        const token = OTPObj.passcode;
        //verify the token is valid 
        //let verify = await otp.verify({secret, token});
        // Verify a counter-based token
        const tokenValidates = speakeasy.hotp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        counter: counter
        });
        
        //if the token is valid 
        if(tokenValidates === true){
            //set verified to true 
            await DB_Driver.updateVerifiedStatus(tokenStr);
            await DB_Driver.updateUserCounter(email)
            return true;
        }
        else{
            
            return false;
        }
    
    }
    catch(e){
        
        return false;
    }




}

    /*
    This method checks that a OTP was authenticated and still exists within time constraints 
    Parameter 1: OTP --- String
    returns the email or false
    */
   async OTPObjValid(OTP){
        const DB_Driver = new DB();

        //get the object
        const OTPObj = await DB_Driver.getOTPObj(OTP );
        //check if the object exists
        if(OTPObj != false){
            //get the verified attribute 
            const verified = OTPObj.verified;
            //if it has been verified 
            if(verified === true){
                return OTPObj.email;
            }
            //verified is not true
            else{
                return false;
            }
        }
        //object does not exist 
        else{
            return false;
        }

   }

    //This method changes the password
    async changePassword(password, OTP){
        try{
        //database driver object 
        const DB_Driver = new DB();


        //verifiy the OTP is valid 
        const authenticated = await this.OTPObjValid(OTP);
        //console.log("Authenticated:  " + authenticated)

        //if OTP is valid
        if(authenticated != false && authenticated != null){

            //create password hash 
            const hash = await this.hashPassword(password);
            //put email into emailStr
            const emailStr = authenticated;
            //update the password
            const updated = await DB_Driver.updatePassword(hash, emailStr);
            console.log("updated: " + updated)
            //if update was sucessful and updated a matched object return true
            if(updated === true){
                return true;
            }
            //else return false 
            else{
                return false;
            }
        }
        //if code is not valid 
        else{
            return false;
        }
    }
    catch(e){
        return false;
    }

    }









}
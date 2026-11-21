# Login-FullStack
This is a full stack web app. I used React for the front end and Express for the backend. I implement authentication with Express. 



To recreate the working version of this:
    A mongo database named "userAccount" with two collections named "AuthCredentials" and "ChangePasswordMFA"
    The "ChangePasswordMFA" collection needs a TTL index expire time in seconds set to 300 with a name of "CreateTime" 

    Run the LoginBackend.js file in the LoginBackEnd folder to run the server and interact with the database

NPM audit vulnerabilities- 1 moderate 2 high

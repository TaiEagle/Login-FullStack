import './createAccount.css'

function CreateAccount(){


    async function submit(e){

        const URL = "http://localhost:3000/CreateAccount"
        //prevent the page from reloading 
        e.preventDefault();

        //get input fields 
        const form = e.target;
        const formData = new FormData(form);

        let firstName = formData.get("firstName");
        let lastName = formData.get("lastName");
        let email = formData.get("email");
        let password = formData.get("password");

        console.log(firstName)
        console.log(lastName)
        console.log(email)
        console.log(password)

        //if any of the fields are empty 

        if(firstName === "" || lastName === "" || email === "" || password === ""){
            //show required error and don't submit 
            const required = document.getElementById("required");
            required.style.visibility = "visible";
            return;
        }
        else{
            const required = document.getElementById("required");
            required.style.visibility = "hidden";
        }

        

        //JSON body 
        const bodyJson = JSON.stringify({firstNameJson: firstName, lastNameJson: lastName, emailJson: email, passwordJson: password})
        
        const response = await fetch(URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: bodyJson


        })
        

        if(response.status === 200){
            //TODO rerout to login page 
            window.location.href = response.url;
        }
        else if(response.status === 500){
                window.alert("The user already exists!");
                
            }
        else{
            //TODO: display error
            const required = document.getElementById("error");
            required.style.visibility = "visible";

        }


        




    }

    return (<div>

        <div className="Main"> 
        <h1>Create Account</h1>
        
        <form method="post" onSubmit={submit}>

            <div className="FirstName">
                <label for="FirstName">First name: <span className="required">*</span>
                    
                </label>
                <input type="text" id="FirstName" name="firstName"></input>
            </div>

            <div className="LastName">
                <label for="LastName">Last name: <span className="required">*</span>
                    
                </label>
                <input type="text" id="LastName" name='lastName'></input>
            </div>


            <div className="Email">
                <label name="Email">Email: <span className="required">*</span>
                    
                </label>
                <input type="text" id="Email" name='email'></input>
            </div>


            <div className="Password">
                <label for="Password">Password: <span className="required">*</span>
                    
                </label>
                <input type="password" id="Password" name='password'></input>
            </div>



            <h6 id='required'>
                Fill out all fields*
            </h6>
            <h6 id='error'>
                An error occured, the account was not successfully created
            </h6>
            <button type="submit">Sign up</button>
            
        </form>
     </div>
        
    </div>)
}

export default CreateAccount;
/**
 * Creator: Dakota Osborne
 * This is a react app for the login page 
 * 
 * 
 * 
 */
import './Login.css'

function Login(){
    async function Submit(e){

        const URL = "http://localhost:3000/Login"
        
        //prevent the browser from reloading the page
        e.preventDefault();
        //read the form data
        const form = e.target;
        
        const formData = new FormData(form);
        const userName = String(formData.get("name"));
        const password = String(formData.get("password"));
       

        if(userName === "" || password === ""){
            document.getElementById("fill").style.visibility = "visible";
        }
        else{
            document.getElementById("fill").style.visibility = "hidden"; 
        }

       
        //send to the server 
        
        const response = await fetch(URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({JSON_userName: userName, JSON_password: password})
        })
       

        
        if(response.status === 200){ //cookie is stored 
            //redirect
            window.location.href = response.url;
            
           
        }
        //if the login was wrong
        else if(response.status === 400){
            
            //show errors 
            document.getElementById("invalid").style.visibility = "visible"; 
        }
        //if anyother error occured show error
        else{
            document.getElementById("error").style.visibility = "visible";
        }
        

    }


    return <>
        <div className='main'>
            <h1 className='component'>Login</h1>
            <form method='post' onSubmit={Submit} >
                <div className='inputFields'>
                    <label className='componentInput'>Username: <span className="required">*</span> </label>
                    <input type='text' className='componentInput' name='name'></input>
                </div>
                <div className='inputFields'>
                    <label className='componentInput'>Password: <span className="required">*</span> </label>
                    <input type='password' className='componentInput'name='password'></input>
                </div>
                
                <h6 className="invalid" id='invalid'>Invalid username or password*</h6>
                <h6 className="fill" id='fill'>Fill out all fields*</h6>
                <h6 id='error'>An error occured*</h6>
                <button className='submit' type="submit" >Submit</button>
            </form>
            
            <a className='component' href='../CreateAccount'>Create account</a>
            <br></br>
            <a className='bottom' href='../ChangePassword'>Forgot password</a>

        </div>
    
    </>
}
export default Login;
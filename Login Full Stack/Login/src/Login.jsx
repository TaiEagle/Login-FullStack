import './Login.css'

function Login(){
    async function Submit(e){

        const URL = "http://localhost:3000/Login"
        //prevent the browser from reloading the page
        e.preventDefault();
        //read the form data
        const form = e.target;
        
        const formData = new FormData(form);
        const userName = formData.get("name");
        const password = formData.get("password");
        //console.log(userName);
        //console.log(password);

        const user = JSON.stringify({JSON_userName: userName, JSON_password: password})

        console.log(user)
        console.log("sumbitted")
        //send to the server 
        
        const response = await fetch(URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({JSON_userName: userName, JSON_password: password})
        });
        //store the token if the response status is ok
        if(response.status === 200){
            const token = response.text();
            //console.log(typeof(token));
            //console.log(token);
            sessionStorage.setItem("token", token);
        }
        else{
            console.log("status not 200");
            //show errors 
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
                
                <h6 className="invalid">Invalid username or password*</h6>
                <h6 className="fill">Fill out all fields*</h6>
                <button className='submit' type="submit" >Submit</button>
            </form>
            
            <a className='component' href='../CreateAccount'>Create account</a>
            <br></br>
            <a className='bottom' href='../ChangePassword'>Forgot password</a>

        </div>
    
    </>
}
export default Login;
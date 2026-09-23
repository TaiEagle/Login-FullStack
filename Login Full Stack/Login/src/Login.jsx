import './Login.css'

function Login(){
    async function Submit(e){
        //prevent the browser from reloading the page
        e.preventDefault();
        //read the form data
        const form = e.target;
        
        const formData = new FormData(form);
        const userName = formData.get("name");
        const password = formData.get("password");
        //console.log(userName);
        //console.log(password);

        const user = {JSON_userName: userName, JSON_password: password}
        console.log(user)
        //send to the server 
        /*
        const response = await fetch("URL", {
            method: "POST",
            body: user
        });
        //store the token if the response status is ok
        if(response.status === 200){
            sessionStorage.setItem("token", response);
        }
        else{
            //show errors 
        }
        
*/
    }


    return <>
        <div className='main'>
            <h1 className='component'>Login</h1>
            <form method='post' onSubmit={Submit} >
                <div className='inputFields'>
                    <label className='componentInput'>username: </label>
                    <input type='text' className='componentInput' name='name'></input>
                </div>
                <div className='inputFields'>
                    <label className='componentInput'>password: </label>
                    <input type='password' className='componentInput'name='password'></input>
                </div>
                <button className='submit' type="submit" >Submit</button>
            </form>
            <a className='component' href='./createAccount.html'>Create account</a>
            <br></br>
            <a className='bottom'>Forgot password</a>

        </div>
    
    </>
}
export default Login;
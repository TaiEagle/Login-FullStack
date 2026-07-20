import './Login.css'

function Login(){
    async function Submit(e){
        //prevent the browser from reloading the page
        e.preventDefault();
        //read the form data
        const form = e.target;
        const formData = new FormData(form);
        
        //send to the server 
        const response = await fetch("URL", {
            method: "POST",
            body: formData
        });
        //store the token if the response status is ok
        if(response.status === 200){
            sessionStorage.setItem("token", response);
        }
        else{
            //show errors 
        }
        

    }


    return <>
        <div className='main'>
            <h1 className='component'>Login</h1>
            <form method='post' onClick={Submit}>
                <div className='inputFields'>
                    <label className='componentInput'>username: </label>
                    <input type='text' className='componentInput' name='name'></input>
                </div>
                <div className='inputFields'>
                    <label className='componentInput'>password: </label>
                    <input type='password' className='componentInput'name='password'></input>
                </div>
                <button className='submit' >Submit</button>
            </form>
            <a className='component'>Create account</a>
            <br></br>
            <a className='bottom'>Forgot password</a>

        </div>
    
    </>
}
export default Login;
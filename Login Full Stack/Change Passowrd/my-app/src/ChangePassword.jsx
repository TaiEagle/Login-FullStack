
import './ChangePassword.css'

function ChangePassword(){

    async function Submit(e){
        e.preventDefault();
        const URL = "http://localhost:3000/UpdatePassword";

        console.log("submitted")
        //get form input
        let form = e.target;
        let formData = new FormData(form);

        let passwordStr = String(formData.get("newPassword"));
        let passwordStr2 = String(formData.get("confirmPassword"));
      

        if(passwordStr === "" || passwordStr2 === ""){
           document.getElementById("requiredField").style.visibility = "visible"; 
            
        }
        else{
            document.getElementById("requiredField").style.visibility = "hidden"; 
        }


        //ensure both passowrds are the same 
        if(passwordStr === passwordStr2){
        //New password object
        const bodyObj = JSON.stringify({password: passwordStr})
       
            //send new password along with cookie
            const response = fetch(URL, {
                method: POST,
                headers: {"Content-type": "application/json"},
                body: bodyObj
            });

            if(response.status === 200){
                //redirect 
            }
            else{
                document.getElementById("error").style.visibility = "visible"; 
            }
        }
        else{
            document.getElementById("badMatch").style.visibility = "visible";
        }


    }

    return(<>
    

    <div className="Main">
        <h1>Change Password</h1>

        <form onSubmit={Submit}>
            <div className="newPassword">
                <label for="newPassword">
                    New Password <span className="required">*</span>
                </label>
                <input type="password" id="newPassword" name="newPassword"></input>
            </div>

            <div className="confirmPassword">
                <label for="confirmPassword"> Confirm Password <span className="required">*</span>  </label>
                <input type="password" name="confirmPassword"></input>
            </div>

            <h6 className='requiredField' id='requiredField'>
                Fill out all fields*
            </h6>
            <h6 id='error'>
                An error occured*
            </h6>
            <h6 id='badMatch'>
                Passwords don't match*
            </h6>

            <button type="submit">Submit</button>



        </form>

    </div>
    
    </>)

    
}
export default ChangePassword
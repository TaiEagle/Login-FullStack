import './createAccount.css'

function CreateAccount(){


    return (<div>

        <div className="Main"> 
        <h1>Create Account</h1>
        
        <form>

            <div className="FirstName">
                <label for="FirstName">First name: <span className="required">*</span>
                    
                </label>
                <input type="text" id="FirstName" name="FirstName"></input>
            </div>

            <div className="LastName">
                <label for="LastName">Last name: <span className="required">*</span>
                    
                </label>
                <input type="text" id="LastName" name='LastName'></input>
            </div>


            <div className="Email">
                <label name="Email">Email: <span className="required">*</span>
                    
                </label>
                <input type="text" id="Email" name='Email'></input>
            </div>


            <div className="Password">
                <label for="Password">Password: <span className="required">*</span>
                    
                </label>
                <input type="password" id="Password" name='Password'></input>
            </div>



            <h6>
                Fill out all fields*
            </h6>
            <button type="submit">Sign up</button>
            
        </form>
     </div>
        
    </div>)
}

export default CreateAccount;
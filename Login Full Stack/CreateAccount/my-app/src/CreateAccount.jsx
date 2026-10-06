import './createAccount.css'

function CreateAccount(){


    return (<div>

        <h1>Create Account</h1>
        
        <form>

            <div>
                <label>First name:
                    <input type="text" id="FirstName"></input>
                </label>
            </div>

            <div>
                <label>Last name:
                    <input type="text" id="LastName"></input>
                </label>
            </div>


            <div>
                <label>Email:
                    <input type="text" id="Email"></input>
                </label>
            </div>


            <div>
                <label>Password:
                    <input type="password" id="Password"></input>
                </label>
            </div>




            <button type="submit">Sign up</button>
            
        </form>
     
        
    </div>)
}

export default CreateAccount;
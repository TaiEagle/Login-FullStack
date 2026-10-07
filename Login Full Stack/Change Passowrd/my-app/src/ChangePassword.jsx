
import './ChangePassword.css'

function ChangePassword(){



    return(<>
    

    <div className="Main">
        <h1>Change Password</h1>

        <form>
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

            <h6>
                Fill out all fields*
            </h6>

            <button type="submit">Submit</button>



        </form>

    </div>
    
    </>)

    
}
export default ChangePassword
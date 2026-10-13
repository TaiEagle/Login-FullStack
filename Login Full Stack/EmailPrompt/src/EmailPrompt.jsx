import './EmailPrompt.css'


function EmailPrompt (){


    return(
        <>
        <div className='main'>

            <h1>Enter your email </h1>
        
            <form>

                <div className='input'>

                    <label for='email'>
                        Email
                    </label>
                    
                    <input type='email' name='email'></input>


                    <button type='submit'>Submit</button>

                </div>


            </form>
            </div>
        </>
    )

}
export default EmailPrompt;
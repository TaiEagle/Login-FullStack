import './EmailPrompt.css'


function EmailPrompt (){


    async function submit(e){

        e.preventDefault();


         const URL = '';


         //get the input data
        let form = e.target;
        let formData = new FormData();


        let email = formData.get("email");
        console.log(email);

        //if the email is empty 
        if(email === null){
            let element = document.getElementById("emptyField");
            element.style.visibility = "visible";
            
        }
        else{
            const response = await fetch(URL, {
                method: "POST",
                headers: {"content-type": "application-json"},
                body: JSON.stringify({Email: email})
            });

            //response is ok
            if(response.status === 200){
                //TODO go to new page
            }
            //response is not ok
            else{
                let element = document.getElementById("doesntExist");
                element.style.visibility = "visible";
            }
        }



         //const response = await fetch() 
    }


    return(
        <>
        <div className='main'>

            <h1>Enter your email </h1>
        
            <form onSubmit={submit}>

                <div className='input'>

                    <label for='email'>
                        Email <span>*</span>
                    </label>
                    
                    <input type='email' name='email'></input>

                    <h6 id='doesntexist'>Email does not exist</h6>
                    <h6 id='emptyField'>Enter all required fields</h6>


                    <button type='submit'>Submit</button>

                </div>


            </form>
            </div>
        </>
    )

}
export default EmailPrompt;
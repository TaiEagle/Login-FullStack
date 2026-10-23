import './OneTimeCode.css'

function OneTimeCode(){

 async function submit(e){

        e.preventDefault();


         const URL = "http://localhost:3000/OneTimeCode";


         //get the input data
        let form = e.target;
        let formData = new FormData(form);


        let code = formData.get("code");
        

        //if the email is empty 
        if(code === null){
            let element = document.getElementById("emptyField");
            element.style.visibility = "visible";
            console.log("email is null")
            
        }
        else{


            let postBody = JSON.stringify({Code: code});
            console.log(postBody);
            const response = await fetch(URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: postBody
            });

            //response is ok
            if(response.status === 200){
                //TODO go to new page
            }
            //response is not ok
            else{
                let element = document.getElementById("invalid");
                element.style.visibility = "visible";
            }
        }



         //const response = await fetch() 
    }

    return    (     <>
        <div className='main'>

            <h1>Enter code </h1>
        
            <form onSubmit={submit}>

                <div className='input'>

                    <label for='email'>
                        Code <span>*</span>
                    </label>
                    
                    <input type='text' name='code'></input>

                    <h6 id='invalid'>Code is invalid</h6>
                    <h6 id='emptyField'>Enter all required fields</h6>


                    <button type='submit'>Submit</button>

                </div>


            </form>
            </div>
        </>)
}
export default OneTimeCode;
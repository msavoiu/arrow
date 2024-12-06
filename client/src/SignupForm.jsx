import {useState} from "react";

function SignupForm() {
    const [username, setUsername] = useState(""); // empty string is the default state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitForm = async(e) => { // e is the event
        e.preventDefault(); // keep the page from refreshing
        try {
            const body = {username, // data inputted into the form
                          email,
                          password};
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            console.log(response);

        } catch (err) {
           console.error(err.message); 
        }
    }

    return (
        <>
            <h1 className="text-center mt-5">Register</h1>
            <form className="d-flex" onSubmit={onSubmitForm}>
                <input type="text" placeholder="Username" className="form-control" value={username} onChange={e => setUsername(e.target.value)}/>
                <input type="text" placeholder="Email" className="form-control" value={email} onChange={e => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" className="form-control" value={password} onChange={e => setPassword(e.target.value)}/>

                <button className="btn btn-success">Sign Up</button>
            </form>
        </>
    );
}

export default SignupForm;
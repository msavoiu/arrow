import {useState} from "react";

function LoginForm() {
    const [username, setUsername] = useState(""); // empty string is the default state
    const [password, setPassword] = useState("");

    const onSubmitForm = async(e) => { // e is the event
        e.preventDefault(); // keep the page from refreshing
        try {
            const body = {username, // data inputted into the form
                          password};
            const response = await fetch("http://localhost:5000/login", {
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
            <h1 className="text-center mt-5">Login</h1>
            <form className="d-flex" onSubmit={onSubmitForm}>
                <input type="text" placeholder="Username" className="form-control" value={username} onChange={e => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" className="form-control" value={password} onChange={e => setPassword(e.target.value)}/>
                <button className="btn btn-success">Login</button>
            </form>
        </>
    );
}

export default LoginForm;
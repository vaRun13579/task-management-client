import { useState } from "react";
import {useUrl} from "../../App.js";
import "./index.css";

const Register = () => {
    const genderArray = ["Male", "Female", "Others"];
    const [visible, setVisible] = useState(false);
    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState(genderArray[0]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const {URL}=useUrl();

    const trigSuccess = () => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
    };

    const onRegister = async (ev) => {
        ev.preventDefault();
        if (!name || !email || !username || !password || !gender) {
            setError("Please fill out all fields.");
            return;
        }

        const regApi = URL+"/register";

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password,
                gender: gender.toLowerCase(),
            }),
        };

        try {
            const response = await fetch(regApi, options);
            const data = await response.json();
            console.log("Register response:", data);

            if (response.ok) {
                trigSuccess();
                setError("");
                setName("");
                setEmail("");
                setUserName("");
                setPassword("");
                setGender(genderArray[0]);
            } else {
                setError(data.message || "Something went wrong!");
            }
        } catch (error) {
            setError("Server error! Please try again later.");
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={onRegister} className="register-container">
                <h1 className="register-text">Register</h1>

                <div className="group-input">
                    <label htmlFor="regName" className="register-label">Name</label>
                    <input id="regName" className="reg-input" type="text" onChange={ev => setName(ev.target.value)} value={name} />
                </div>

                <div className="group-input">
                    <label htmlFor="regUN" className="register-label">Username</label>
                    <input id="regUN" className="reg-input" type="text" onChange={ev => setUserName(ev.target.value)} value={username} />
                </div>

                <div className="group-input">
                    <label htmlFor="regEmail" className="register-label">Email</label>
                    <input id="regEmail" className="reg-input" type="text" onChange={ev => setEmail(ev.target.value)} value={email} />
                </div>

                <div className="group-input">
                    <label htmlFor="regPW" className="register-label">Password</label>
                    <div className="password-cont">
                        <input id="regPW" className="reg-input pw" type={visible ? "text" : "password"} onChange={ev => setPassword(ev.target.value)} value={password} />
                        <input className="check-input" type="checkbox" checked={visible} onChange={() => setVisible(prev => !prev)} />
                    </div>
                </div>

                <div className="group-input">
                    <label htmlFor="regGen" className="register-label">Gender</label>
                    <select id="regGen" className="reg-input" value={gender} onChange={ev => setGender(ev.target.value)}>
                        {genderArray.map(ele => <option key={ele} value={ele}>{ele}</option>)}
                    </select>
                </div>

                <button type="submit" className="register-button">Register</button>

                {error && <p className="error-para">* {error}</p>}
                {success && <p className="success-msg">User registered successfully, Please login.</p>}
            </form>
        </div>
    );
};

export default Register;

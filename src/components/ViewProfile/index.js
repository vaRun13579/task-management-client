import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import { useUrl } from "../../App";
import "./index.css";

const ViewProfile=()=>{
    const g=["male", "female", "others"];
    const [name, setName]=useState("");
    const [username, setUserName]=useState("");
    const [email, setEmail]=useState("");
    const [gender, setGender]=useState(g[0]);
    const [edit, setEdit]=useState(false);
    const [successMsg, setMsg]=useState("");
    const [errorMsg, setError]=useState("");
    const token=Cookies.get('jwt_token');
    const navigate=useNavigate();
    const {URL}=useUrl();

    async function saveEditedProfile(){
        if(edit){
            const api=`${URL}/profile/edit`;
            const options={
                method:"PUT",
                headers:{
                    'authorization':`Bearer ${token}`,
                    'Content-Type': `application/json`
                },
                body:JSON.stringify({name, username, email, gender})
            };

            try{
                const response= await fetch(api, options);
                const data = await response.json();
                console.log("save edit response:", data);
                if(response.ok){
                    console.log("successfully edited the profile");
                    setMsg("Profile edit Successful");
                    setTimeout(()=>{setMsg("");},3000);
                }
                else{
                    console.log("something went wrong in editing profile:",data);
                    setError(data.message);
                    setTimeout(()=>{setError("")},3000);
                    call();
                }
            } catch(er){
                console.log("something went wrong while rendering the profile");
                setError("something went wrong");
            }
        }
        setEdit(ps=>!ps);
    }

    async function call(){
        const api=`${URL}/profile`;
        const options={
            method:"GET",
            headers:{
                'authorization':`Bearer ${token}`
            }
        };
        try{
            const response= await fetch(api, options);
            const data = await response.json();
            console.log("profile data:", data);
            if(response.ok){
                const {name, username, email, gender}=data;
                setName(name); setUserName(username); setEmail(email); setGender(gender);
            }
            else{
                console.log("something went wrong");
            }
        } catch(er){
            console.log("something went wrong");
        }
    }

    useEffect(()=>{
        call();
        // eslint-disable-next-line
    },[]);

    return(
        <div className="profile-main-page">
            <button className="back-button" onClick={()=>{navigate("/")}}>Back</button>
            <form className="profile-details-container" onSubmit={(ev)=>{ev.preventDefault();}}>
                <button className="edit-button-profile" onClick={()=>{saveEditedProfile()}}>{edit?"Save":"Edit"}</button>
                <div className="profile-pic-name-container">
                    <div className="profile-pic-container">{username.toUpperCase()[0]}</div>
                    <input readOnly={!edit} className={`input-profile-name-edit ${edit?"editable":""}`} value={name} onChange={(ev)=>{setName(ev.target.value)}}/>
                </div>
                <label className="labled-data" htmlFor="usnameId">Username:</label>
                <input className={`input-data ${edit?"editable":""}`} readOnly={!edit} id="usnameId" type="text" value={username} onChange={(ev)=>{setUserName(ev.target.value)}}/><br/>

                <label className="labled-data" htmlFor="emailId">Email:</label>
                <input className={`input-data ${edit?"editable":""}`} readOnly={!edit} id="emailId" type="text" value={email} onChange={(ev)=>{setEmail(ev.target.value)}}/><br/>

                <select className={`input-data ${edit?"editable":""}`} disabled={!edit} value={gender} onChange={(ev)=>{setGender(ev.target.value)}}>
                    <option value={g[0]}>{g[0]}</option>
                    <option value={g[1]}>{g[1]}</option>
                    <option value={g[2]}>{g[2]}</option>
                </select>
                <p className="ermessage">{errorMsg}</p>
                <p className="successmsg">{successMsg}</p>
            </form>
        </div>
    )
}

export default ViewProfile;
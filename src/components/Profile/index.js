import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import { useUrl } from "../../App";
import "./index.css"

const Profile = (props)=>{
    const {updateName}=props;
    const {URL}=useUrl();
    const token=Cookies.get('jwt_token');
    const [details, setDetails]=useState({});
    const api=URL+"/profile";
    const navigate=useNavigate();

    const options={
        method:"GET",
        headers:{
            'Authorization':`Bearer ${token}` 
        }
    }

    useEffect(()=>{
        async function call(){
            try{
                const response=await fetch(api,options);
                const data=await response.json();
                if (response.ok){
                    setDetails(data);
                    updateName(data.name);
                }
            } catch(er){
                console.log(er.message);
            }
        }
    call()}, []);

    console.log("profile details ", details);

    return (
        <div onClick={()=>{navigate('/viewprofile')}} className="profile-pic">{details.username?.toUpperCase()[0]}</div>
    )
}

export default Profile
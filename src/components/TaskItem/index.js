import {useState} from "react";
import Cookies from "js-cookie";
import { useUrl } from "../../App"; 
import "./index.css";

const TaskItem= (props)=>{
    const {item, deletes, reloadList, setLoading}=props;
    const {id, title, description, status, priority, bgColor}=item;
    const [edit, setEdit]=useState(false);
    const [eTitle, setTitle]=useState(title);
    const [eDescription, setDesc]=useState(description);
    const [eStatus, setStatus]=useState(status);
    const [ePriority, setPriority]=useState(priority);
    const token=Cookies.get('jwt_token');
    const {URL}=useUrl();


    // const colors=["#EDDFE0","#73EC8B","#6A9AB0","#C96868","#FCDE70","#EAE4DD","#EECAD5"];

    // function getRandomColor(){
    //     const l=colors.length;
    //     return colors[Math.floor(Math.random()*1000)%l];  
    // }



    const saveEdit=()=>{
        async function call(){
            const api=`${URL}/task/${id}/edit`;
            const options={
                method:"PUT",
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    'title': `${eTitle}`,
                    'description':`${eDescription}`,
                    'status':`${eStatus}`,
                    'priority':`${ePriority}`
                })
            };

            try{
                setLoading(true);
                const response=await fetch(api, options);
                const data=await response.json();
                if (response.ok){reloadList();console.log("update todo item,", data);}
                else{
                    setLoading(false);
                    console.log(data);
                }
            } catch(er){
                setLoading(false);
                console.log(er.message);
            }
        }
        call();
    };

    // console.log(getRandomColor());
    let pColor="white";
    switch(priority){
        case "High":
            pColor="#d34726";
            break;
        case "Medium":
            pColor="#f8a018";
            break;
        case "Low":
            pColor="#71974c";
            break;
        default:
            pColor="white";
    }
    return ( 
        <li className="list-item" style={{backgroundColor:bgColor}}>
            <div className="item-wrapper">
                {!edit && <h1 className='item-heading'>{eTitle}</h1>}
                {edit && <input className="input-task-item item-heading" value={eTitle} onChange={(ev)=>{setTitle(ev.target.value)}} type="text"/>}
                <hr className="line"/>
                {!edit && <p className="item-desc">{eDescription}</p>}
                {edit && <textarea rows="4" className="text-area-task-item item-desc" onChange={(ev)=>{setDesc(ev.target.value)}} value={eDescription}/>}
                {!edit && <div className="priority" style={{color:pColor}}><span className="dot" style={{backgroundColor:pColor}}></span>{ePriority.toUpperCase()}</div>}
            </div>
            <div className="functional-buttons">
                {edit && <button onClick={()=>{saveEdit();setEdit(ps=>!ps); }} className="edit-item">Save</button>}
                {!edit && <button onClick={()=>{setEdit(ps=>!ps)}} className="edit-item">Edit</button>}
                {!edit && <button className="delete-item-button" onClick={()=>{deletes(id)}}>Delete</button>}
                {!edit && <div className="status">{eStatus}</div>}
                {edit && <select value={eStatus} onChange={(ev)=>{setStatus(ev.target.value)}} className="status">
                    <option value="in progress">in progress</option>
                    <option value="done">done</option>
                    <option value="pending">pending</option>
                    <option value="completed">completed</option>
                </select>}
                {edit && <select value={ePriority} onChange={(ev)=>{setPriority(ev.target.value)}} className="status">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>}
            </div>
        </li>
    )
}

export default TaskItem;
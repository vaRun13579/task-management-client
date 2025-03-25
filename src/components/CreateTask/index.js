import {useState} from "react";
import "./index.css";

const CreateTask=(props)=>{
    const {create}=props;
    const s=["done","in progress","pending","completed"];
    const [heading, setHeading]=useState("");
    const [description, setDescription]=useState("");
    const [status, setStatus]=useState(s[0]);
    const [warning, setWarning]=useState("");
    const [priority, setPriority]=useState("Medium");

    return (
        <form onSubmit={(ev)=>{
            ev.preventDefault();
            if (heading===""){
                console.log("Can't creat a todo with empty task");
                setWarning("Please add some task to create a Todo item");
                setTimeout(()=>{setWarning("")},3000);
                return;
            }
            create({title:heading, description, status, priority});
        }} className="task-create-container">
            <input type="text" placeholder="Task..." value={heading} onChange={(ev)=>{setHeading(ev.target.value)}} className="create-task-heading"/><br/>
            <hr className="seperator-line"/>
            <textarea placeholder="Description" value={description} onChange={(ev)=>{setDescription(ev.target.value)}} className="create-task-description" /><br/>
            <span style={{display:"flex", gap:"10px"}}>
                <select className="select-category-status" value={status} onChange={(ev)=>{setStatus(ev.target.value)}}>
                    <option value={s[0]}>{s[0]}</option>
                    <option value={s[1]}>{s[1]}</option>
                    <option value={s[2]}>{s[2]}</option>
                    <option value={s[3]}>{s[3]}</option>
                </select>
                <select className="select-category-status" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select><br/>
            </span>
            <div style={{height:"10px"}}></div>
            <button className="create-button" type="submit">Create Todo</button>
            {warning!=="" && <p className="warning">*{warning}</p>}
        </form>
    )
}

export default CreateTask;
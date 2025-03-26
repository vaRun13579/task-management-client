import { Component } from "react";
import { FallingLines } from "react-loader-spinner";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import {useUrl} from "../../App";
import CreateTodo from "../CreateTask";
import TaskItem from "../TaskItem";
import Profile from "../Profile";
import "./index.css";

const filters = ["", "done", "in progress", "pending", "completed"];

class Dashboard extends Component {
    state = { todoList: [], filter: filters[0], taskDone: 0, name: "", createTodo: false, searchQuery: "", proFilter:"", isLoading:false};

    setLoading=(v)=>{this.setState({isLoading:v})}

    deleteATask = async (id) => {
        this.setState({isLoading:true});
        const {URL}=this.props;
        const api = `${URL}/task/${id}/delete`;
        const token = Cookies.get('jwt_token');
        const options = {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        await fetch(api, options);
        this.fetchList();
    };

    updateName = (name) => {
        this.setState({ name });
    };

    updateTaskDone = (n) => {
        this.setState({ taskDone: n });
    };

    logout = () => {
        Cookies.remove('jwt_token');
        this.props.navigate('/login', { replace: true });
    };

    fetchList = async () => {
        this.setState({isLoading:true});
        const token = Cookies.get('jwt_token');
        const {URL}=this.props;
        const api = URL;
        const options = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        try{
            const response = await fetch(api, options);
            const data = await response.json();
            this.setState({isLoading:false});
            if (response.ok) {
                const n = data.filter(ele => "done completed".includes(ele.status.toLowerCase())).length;
                this.setState({ todoList: data, taskDone: n });
            } else{
                console.log("something went wrong while loading the list");
            }
        } catch(er){
            this.setState({isLoading:false});
            console.log(er.message);
        }
    };

    createTodoFun = async (obj) => {
        this.setState({isLoading:true});
        const token = Cookies.get("jwt_token");
        const {URL}=this.props;
        const api = URL+"/task/add";
        const options = {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        };
        await fetch(api, options);
        this.fetchList();
        this.setState({ createTodo: false });
    };

    getGreeting = (d) => {
        const hours = d.getHours();
        if (hours >= 4 && hours < 12) return "Good Morning";
        if (hours >= 12 && hours < 16) return "Good Afternoon";
        if (hours >= 16 && hours < 20) return "Good Evening";
        return "Good Night";
    };

    componentDidMount = () => {
        this.fetchList();
    };

    handleSearch = (event) => {
        this.setState({ searchQuery: event.target.value });
    };

    render() {
        const { todoList, filter, taskDone, name, createTodo, searchQuery, proFilter, isLoading } = this.state;
        const todos = todoList.length;
        let percent = todos === 0 ? "0%" : Math.round((taskDone / todos) * 100) + "% Done";
        
        const filteredTasks = todoList
            .filter(ele => ele.status.toLowerCase().includes(filter.toLowerCase()))
            .filter(ele => ele.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(ele => ele.priority.toLowerCase().includes(proFilter.toLowerCase()));

        const today = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dateTag = today.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });

        return (
            <div className="home-container">
                {createTodo && (
                    <div className="modal">
                        <button className="close-button" onClick={() => this.setState({ createTodo: false })}>Close</button>
                        <CreateTodo create={this.createTodoFun} />
                    </div>
                )}
                <div className="main-container" style={{ pointerEvents: createTodo ? "none" : "all", opacity: createTodo ? "0.2" : "1" }}>
                    <div className="profile-container">
                        <Profile updateName={this.updateName} />
                        <button className="logout-btn" onClick={this.logout}>Logout</button>
                    </div>
                    <h1 className="greeting-user">{this.getGreeting(today)} {name}</h1>
                    <div className="day-container">
                        <p className="para-day">Today's {days[today.getDay()]}<br /><span className="light-text">{dateTag}</span></p>
                        <p className="para-day" style={{ textAlign: "right" }}>{percent}<br /><span className="light-text">Completed tasks</span></p>
                    </div>
                    
                    {/* Search Bar */}
                    <span style={{display:"flex", gap:"15px"}}>
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="search-bar" 
                            value={searchQuery} 
                            onChange={this.handleSearch} 
                        />
                        <select className="priority-filter" value={proFilter} onChange={(e)=>{this.setState({proFilter:e.target.value})}}>
                            <option value="">All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </span>

                    <ul className="filter-container">
                        <li onClick={() => this.setState({ filter: filters[0] })} className={filter === "" ? "active-filters" : "filters"}>All</li>
                        <li onClick={() => this.setState({ filter: filters[1] })} className={filter === "done" ? "active-filters" : "filters"}>Done</li>
                        <li onClick={() => this.setState({ filter: filters[2] })} className={filter === "in progress" ? "active-filters" : "filters"}>In Progress</li>
                        <li onClick={() => this.setState({ filter: filters[3] })} className={filter === "pending" ? "active-filters" : "filters"}>Pending</li>
                        <li onClick={() => this.setState({ filter: filters[4] })} className={filter === "completed" ? "active-filters" : "filters"}>Completed</li>
                    </ul>
                    <div className="loader-container"><FallingLines color="white" width="50" visible={isLoading} ariaLabel="falling-circles-loading" /></div>
                    {filteredTasks.length > 0 ? (
                        <ul className="task-list">
                            {filteredTasks.map(ele => <TaskItem key={ele.id} deletes={this.deleteATask} reloadList={this.fetchList} setLoading={this.setLoading} item={ele} />)}
                        </ul>
                    ) : (
                        <div className="indication">No matching tasks found.</div>
                    )}

                    <button className="add-task" onClick={() => this.setState({ createTodo: true })}>+</button>
                </div>
            </div>
        );
    }
}

function DashboardWrapper(props) {
    const navigate = useNavigate();
    const {URL}=useUrl();
    return <Dashboard {...props} navigate={navigate} URL={URL} />;
}

export default DashboardWrapper;

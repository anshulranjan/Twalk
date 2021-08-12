import {Component, React} from "react";
import { findPeople, follow } from "./apiuser";
import { isAuthenticated } from "../auth/Index";
import {Link} from "react-router-dom";
import DefaultProfile from "../images/user-avatar.png"
class FindPeople extends Component{
    constructor(){
        super();
        this.state ={
            users: [],
            error:"",
            open: false,
            followMessage: "",
            loading:true
        }
    }
    componentDidMount(){
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId,token).then(data =>{
            if(data.error){
                console.log("ERROR");
            }
            else{
                this.setState({users:data, loading:false});
            }
        })
    }
    clickFollow = (person,i) =>{
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        follow(userId,token,person._id).then(data =>{
            if(data.error)
            {
                this.setState({error: data.error});
            } else{
                let toFollow = this.state.users;
                toFollow.splice(i, 1);
                this.setState({users:toFollow , open: true, followMessage: `Following ${person.name}` });
            }
        });
    }
    renderUsers = (users) => (
        <div>
                    {users.map((user, i) => (
                        <div className="card container mb-3" style={{maxWidth: "540px"}} key = {i}>
                        <div className="row g-0">
                          <div className="col-md-4">
                            <img
                              src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                              onError = {i=> (i.target.src = `${DefaultProfile}`)}
                              alt={user.name}
                              className="img-fluid"
                              style={{width:'100%', height:'15vw', objectFit:'cover'}}
                            />
                          </div>
                          <div className="col-md-8">
                            <div className="card-body">
                              <h3>{user.name}</h3>
                              <p className="card-text text-muted">
                                {user.job && (<>Working as {user.job}<br /></>)}
                                {user.job && (<>Lives in {user.city}<br /></>)}
                                {user.college && (<>Goes to {user.college}</>)}
                              </p>
                              <p className="card-text">
                                <small className="text-muted">Last updated 3 mins ago</small>
                              </p>
                              <div className="container">
                                <div className="row">
                                    <div className="col-md">
                                    <Link to={`/user/${user._id}`} className="btn btn-raised btn-success btn-rounded">View Profile</Link>
                                    </div>
                                    <div className="col-md">
                                    <button onClick={() => this.clickFollow(user,i)} className="btn btn-success btn-raise">Follow</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                </div>
    )
    render(){
        const {users, open, followMessage, error , loading} = this.state;
        
        return(
            <div className="container">
                <h1 className="mt-5 mb-5 text-center">Suggested Users</h1>
                {loading ? (<div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                    </div>) : ("")}
                <div className="alert alert-danger" style={{display: error? "":"none"}}>{error}</div>
                <div className="alert alert-success" style={{display: open? "":"none"}}>{followMessage}</div>
                {this.renderUsers(users)}
            </div>

        )
    }
}
export default FindPeople;





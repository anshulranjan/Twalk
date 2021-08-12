import {Component, React} from "react";
import { list } from "./apiuser";
import {Link} from "react-router-dom";
import DefaultProfile from "../images/user-avatar.png"
class Users extends Component{
    constructor(){
        super();
        this.state ={
            users: [],
            loading: true
        }
    }
    componentDidMount(){
        list().then(data =>{
            if(data.error){
                console.log("ERROR");
            }
            else{
                this.setState({users:data, loading: false});
            }
        })
    }
    renderUsers = (users) => (
        <>
                    {users.map((user, i) => (
                        <div className="card container mb-3" style={{maxWidth: "500px"}} key = {i}>
                        <div className="row g-6">
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
                                {user.updated && (<small className="text-muted">{`Last updated ${new Date(user.updated).toDateString()}`}</small>)}
                              </p>
                              <Link to={`/user/${user._id}`} className="btn btn-raised btn-success btn-rounded mr-5">View Profile</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </>
    )
    render(){
        const {users, loading} = this.state;
        
        return(
            <div className="container">
                <h1 className="mt-5 mb-5 text-center">All Users</h1>
                {loading ? (<div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                    </div>) : ("")}
                {this.renderUsers(users)}
            </div>

        )
    }
}
export default Users;





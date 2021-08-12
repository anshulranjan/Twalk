import {Component, React} from "react";
import { isAuthenticated } from "../auth/Index";
import {remove} from "./apiuser";
import { Redirect} from "react-router-dom";
import {signout} from "../auth/Index";
class Deleteuser extends Component{
    state = {
        redirect: false
    }
    deleteAccount = () => {
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId,token)
        .then(data => {
            if(data.error)
            {
                console.log(data.error);
            } else{
                signout(() => {
                    console.log("User deleted successfully");
                    this.setState({redirect: true});
                });
            }

        })

    }
    deleteConfirmed = () =>{
        let answer = window.confirm("Are you sure to delete your account?");
        if(answer)
        {
            this.deleteAccount();
        }
    }
    render(){
        if(this.state.redirect){
            return(<Redirect to="/" />)
        }
        return(
            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger btn-rounded">Delete Profile</button>
        )
    }
}
export default Deleteuser;

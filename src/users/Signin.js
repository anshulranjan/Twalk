import React, { Component } from "react";
import {Redirect} from "react-router-dom";
import {signin, authenticate} from '../auth/Index';
import { Link } from "react-router-dom";
import SocialLogin from "./SocialLogin";
class Signin extends Component{
    constructor()
    {
        super();
        this.state = {
            email:"",
            password:"",
            error:"",
            redirectToRefer: false,
            loading: false
        };
    }
    handleChange = (name) => (event) =>{
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value });
    };
    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true});
        const {email, password} = this.state;
        const user = {
            email: email,
            password: password
        };
        signin(user).then(data =>{
            if(data.error){
                this.setState({error : data.error, loading: false});
            }
            else{
                authenticate(data, ()=>{
                    this.setState({redirectToRefer: true})
                });
            }
        });
    };
    componentDidMount(){
        if(this.props.location.state){
            this.setState({error: "You must be Logged In to perform this action"})
        }
     }
    signinForm = (email, password) =>
    (
        <form>
                    <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}></input>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Password</label>
                        <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}></input>
                    </div>
                    <button onClick={this.clickSubmit} className = "btn btn-raised btn-primary">Submit</button>
                </form>
    );
    render(){
        const {email, password, error, redirectToRefer, loading} = this.state;
        if(redirectToRefer)
        {
            return <Redirect to ="/"></Redirect>
        }
        return(
            <div className = "container">
                <h1 className="mt-5 mb-5 text-center">Sign In</h1>

                <div className="alert alert-danger" style={{display: error? "":"none"}}>{error}</div>
                {loading ? (<div className="jumbotron text-center">
                    <h2>Loading...</h2>
                    </div>) : ("")} 
                {this.signinForm(email, password)}
                <p>
                    <Link to="/forgot-password" className="text-danger">
                    {" "}
                    Forgot Password
                    </Link>
                </p>
                <hr />
                <SocialLogin />

            </div>
        )
    }

}

export default Signin;
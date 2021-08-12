import React, { Component } from "react";
import {signup} from '../auth/Index';
import {Link} from "react-router-dom";
class Signup extends Component {
    constructor()
    {
        super();
        this.state = {
            name:"",
            email:"",
            password:"",
            error:"",
            open: false
        };
    }
    handleChange = (name) => (event) =>{
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value });
    };
    clickSubmit = event => {
        event.preventDefault();
        const {name, email, password} = this.state;
        const user = {
            name: name,
            email: email,
            password: password
        };
        signup(user).then(data =>{
            if(data.error) this.setState({error : data.error});
            else this.setState({
                name: "",
                error: "",
                email: "",
                password:"",
                open: true
            });
        });
    };
    signupForm = (name, email, password) =>
    (
        <form>
                    <div className="form-group">
                        <label className="text-muted">Name</label>
                        <input onChange={this.handleChange("name")} type="text" className="form-control" value={name}></input>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Email</label>
                        <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}></input>
                    </div>
                    <div className="form-group">
                        <label className="text-muted">Password</label>
                        <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}></input>
                    </div>
                    <button onClick={this.clickSubmit} className = "btn btn-raised btn-primary">Register</button>
                </form>
    );
    render(){
        const {name, email, password, error,open} = this.state;
        return(
            <div className = "container">
                <h1 className="mt-5 mb-5 text-center">Sign Up</h1>

                <div className="alert alert-danger" style={{display: error? "":"none"}}>{error}</div>
                <div className="alert alert-success" style={{display: open? "":"none"}}>New Account is successfully created. Please <Link to="/signin">Sign In</Link>.</div>
                {this.signupForm(name, email, password)}
            </div>

        )
    }
}

export default Signup;
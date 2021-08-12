import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/Index";
import {create} from './apiPost'

class NewPost extends Component{
    constructor()
    {
        super();
        this.state = {
            title: "",
            body: "",
            photo: "",
            error: "",
            loading: false,
            user: {},
            fileSize: 0,
            redirectToProfile: false
        }
    }
    componentDidMount(){
        this.postData = new FormData();
        this.setState({user: isAuthenticated().user});
    }
    isValid = () => {
        const { title, body, fileSize} = this.state;
        if (fileSize > 100000) {
            this.setState({ error: "File Size should be less than 100Kb", loading: false});
            return false;
          }
          if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false});
            return false;
          }
          if (title.length < 4 || title.length > 150) {
            this.setState({ error: "Title length should be between 4 and 150 chanracters", loading: false});
            return false;
        }
        if (body.length < 4 || body.length > 2000) {
            this.setState({ error: "Body should be between 4 to 2000 characters", loading: false});
            return false;
          }
        return true;
    };

    handleChange = (name) => (event) =>{
        this.setState({error: ""});
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size: 0;
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize});
    };
    clickSubmit = event => {
        event.preventDefault();
        this.setState({loading: true});
        if(this.isValid()){
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId,token, this.postData).then(data =>{
                if(data.error)
                {   
                    this.setState({error : data.error});
                }else{
                    console.log("New Post");
                    this.setState({loading: false, title: "", body:"", photo: "", redirectToProfile: true});
                }
            });
        } else{
            this.setState({loading: false});
        }
    };
    createForm = (title,body) =>
    (
        <form>
                    <div className="card mt-5">
                    
                    <div className="card-body">
                        <div className="form-group">
                            <label className="text-muted">Post Photo</label>
                            <input onChange={this.handleChange("photo")} type="file" accept="image/*" className="form-control"></input>
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Title</label>
                            <input onChange={this.handleChange("title")} type="text" className="form-control" value={title}></input>
                        </div>
                        <div className="form-group">
                            <label className="text-muted">Body</label>
                            <textarea onChange={this.handleChange("body")} type="text" className="form-control" value={body}></textarea>
                        </div>
                    </div>
                    </div>
                    <button onClick={this.clickSubmit} className = "btn btn-raised btn-primary mt-5">Create Post</button>
        </form>
    );
    render(){
        const {title, body, error, loading, user, photo, redirectToProfile} = this.state;
        if(redirectToProfile)
        {
            return (<Redirect to={`/user/${user._id}`} />);
        }
        return(
            <div className = "container">
                <h1 className="mt-5 mb-5 text-center">Create Post</h1>
                <div className="alert alert-danger" style={{display: error? "":"none"}}>{error}</div>
                {loading ? (<div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                    </div>) : ("")}
                {this.createForm(title, body)}
            </div>
        )
    }
}
export default NewPost;
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../auth/Index";
import DefaultProfile from "../images/user-avatar.png";
import Deleteuser from "./Deleteuser";
import {read} from './apiuser';
import FollowProfile from "./FollowProfile";
import ProfileTabs from "./ProfileTabs";
import {listByUser} from "../post/apiPost";
class Profile extends Component{
    constructor()
    {
        super();
        this.state = {
            user: {following: [] , followers:[] },
            redirectToSignIn : false,
            following: false,
            loading:true,
            loading1: true,
            error: "",
            posts:[]
        }
    }
    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };
    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
          // one id has many other ids (followers) and vice versa
          return follower._id === jwt.user._id;
        });
        return match;
    };
    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
    
        callApi(userId, token, this.state.user._id).then(data => {
          if (data.error) {
            this.setState({ error: data.error });
          } else {
            this.setState({ user: data, following: !this.state.following });
          }
        });
    };
    init = (userid) => {
        const token = isAuthenticated().token;
        read(userid,token)
        .then(data =>{
            if(data.error){
                this.setState({redirectToSignIn : true});
            } else{
                let following = this.checkFollow(data)
                this.setState({user:data , following, loading:false});
                this.loadPosts(data._id);
            }
        });
    }
    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token)
        .then(data =>{
            if(data.error){
                this.setState({redirectToSignIn : true});
            } else{
                this.setState({posts:data, loading1: false});
            }
        });
    }
    componentDidMount(){
        const userid = this.props.match.params.userId;
        this.init(userid);
        
    }
    componentWillReceiveProps(props){
        const userid = props.match.params.userId;
        this.init(userid);
        
    }
    render(){
        const {redirectToSignIn , user, loading, posts , loading1} = this.state;
        if(redirectToSignIn) return <Redirect to ="/signin" />
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;
        return(
                <>
                <div className="container">
                <h1 className="mt-5 text-center">Profile</h1>
                {loading ? (<div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                    </div>) : ("")}
                <div className="card mb-4">
                    <div class="card-header">
                    <div className="row mt-3">
                    <div className = "col-sm">
                        <img
                            src={photoUrl}
                            alt={user.name}
                            className="img-thumbnail"
                            onError = {i=> (i.target.src = `${DefaultProfile}`)}
                            style={{height:"200px",width:"auto", objectFit:'cover'}}
                            />
                    </div>
                    <div className = "col-sm">        
                            <div className="card-body lead">
                            <p><b>{user.name}</b></p>
                            <p><b>Email: </b>{user.email}</p>
                            <p>{`Joined: ${new Date(user.created).toDateString()}`}</p>
                            {isAuthenticated().user && isAuthenticated().user._id === this.state.user._id ? (
                            <div className="d-inline-block mt-3">
                                <Link to={`/user/edit/${this.state.user._id}`} className="btn btn-raised btn-success btn-rounded mr-5">Update Profile</Link>
                                <Deleteuser userId={user._id}/>
                            </div>
                            ) : (
                            <FollowProfile following={this.state.following} onButtonClick={this.clickFollowButton}/>
                            )}
                            <hr />
                            <ProfileTabs follower = {user.followers} following = {user.following} />
                            </div>
                        </div>
                    </div>
                    </div>
                    </div>
                    <div className="row mb-3">
                    <div className = "col-sm">
                        <div className = "card">
                        <div className="card-body">
                        <h1>About</h1>
                        <div className="lead">
                        {user.relation && user.relation !== "Select" && (<p><b>I am {user.relation}</b></p>)}
                        <p><b>My Intro: </b>{user.about}</p>
                        {user.gender && user.gender !== "Select" && (<p><b>Gender: </b>{user.gender}</p>)}
                        <p><b>Current City: </b> {user.city}</p>
                        </div>
                        </div>
                        </div>
                    </div>
                    <div className = "col-sm">
                        <div className = "card">
                        <div className="card-body">
                        <h1>Work and Education</h1>
                        <div className="lead">
                        <p><b>Currently, Working as </b> {user.job}</p>
                        <p><b>My College: </b>{user.college}</p>
                        <p><b>My School: </b>{user.school}</p>
                        </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <h2 className="mt-5 mb-3 text-center">Posts</h2>
                    {loading1 ? (<div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                    </div>
                    </div>) : ("")}
                    {!posts.length && !loading1 && (<div class="card mt-3 mb-4"> <div class="card-body"><h4>No Posts Available</h4></div></div>)}

                    {posts.map((post, i) => {
                        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
                        const posterName = post.postedBy ? post.postedBy.name : " Unknown";
                        const photoUrl = post.postedBy._id ? `${process.env.REACT_APP_API_URL}/user/photo/${post.postedBy._id}?${new Date().getTime()}` : DefaultProfile;
                        return(
                        <div className="container my-5 py-2" key = {i}>
                            <div className="row d-flex justify-content-center">
                            <div className="col-md-12 col-lg-10 col-xl-8">
                                <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-start align-items-center">
                                    <img
                                        src={photoUrl}
                                        alt={posterName}
                                        className="rounded-circle shadow-1-strong me-3"
                                        width="60"
                                        height="60"
                                        onError = {i=> (i.target.src = `${DefaultProfile}`)}
                                        
                                    />
                                    <div>
                                        <h6 className="fw-bold text-primary mb-1">{" "}<Link to={`${posterId}`}> {posterName}{" "} </Link></h6>
                                        <p className="text-muted small mb-0">
                                        Shared publicly - {new Date(post.created).toDateString()}
                                        </p>
                                    </div>
                                    </div>
                                    <Link to={`/post/${post._id}`} style={{ textDecoration: 'none', color:"black"}} >
                                    <p className="mt-3 mb-4 pb-2">
                                        <h5>{post.title}</h5>
                                        {post.body}
                                    </p>
                                    {post.photo && (
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                                    alt={post.title}
                                                    className="img-thunbnail mb-3 contain"
                                                    style={{ height: "400px", width: "100%" }}
                                                />
                                    )}
                                    <div className="small d-flex justify-content-start">
                                        {this.checkLike(post.likes) ? (
                                                <h3 className="d-flex align-items-center me-3">
                                                <i
                                                    className="fa fa-thumbs-up text-primary"
                                                    style={{ padding: "10px", borderRadius: "50%" }}
                                                    />{" "}
                                                    {post.likes.length} Likes
                                                    </h3>
                                                    ) : (
                                                    <h3 className="d-flex align-items-center me-3">
                                                        <i
                                                            className="fas fa-thumbs-up text-light"
                                                            style={{ padding: "10px", borderRadius: "100%", borderWidth:"10px", textShadow: "0 0 3px #000" }}
                                                        />{" "}
                                                        {post.likes.length} Likes
                                                        </h3>
                                                    )}
                                        <h3 className="d-flex align-items-center me-3">
                                            <i className="fa fa-comment text-dark bg-white"
                                            style={{ padding: "10px", borderRadius: "50%" }}
                                            ></i>
                                            {" "}
                                            {post.comments.length} Comments
                                        </h3>
                                    </div>
                                    </Link>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
            </>
        );
    }
}

export default Profile;

                
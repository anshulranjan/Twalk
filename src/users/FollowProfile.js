import React, { Component } from "react";
import {follow , unfollow } from "./apiuser";
class FollowProfile extends Component{

    followClick = () =>{
        this.props.onButtonClick(follow);
    }
    unfollowClick = () =>{
        this.props.onButtonClick(unfollow);
    }

    render(){
        return(
            <div className="d-inline-block mt-3">
                {!this.props.following ? (
                    <button onClick ={this.followClick} className="btn btn-success btn-raise mr-5">
                    Follow
                </button>
                ) : (
                    <button onClick ={this.unfollowClick} className="btn btn-warning btn-raise">
                    Unfollow
                </button>
                )}
                
            </div>
        )
    }
}
export default FollowProfile;



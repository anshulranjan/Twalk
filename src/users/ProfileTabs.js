import React, {Component } from "react";
import {Modal} from 'react-responsive-modal';
import { Link } from "react-router-dom";
import 'react-responsive-modal/styles.css';
import DefaultProfile from "../images/user-avatar.png";

class ProfileTabs extends Component{
    state={
        openModal1 : false,
        openModal2 : false
    }

    onClickButton1 = e =>{
        e.preventDefault()
        this.setState({openModal1 : true})
    }
    onClickButton2 = e =>{
        e.preventDefault()
        this.setState({openModal2 : true})
    }

    onCloseModal1 = ()=>{
        this.setState({openModal1 : false})
    }
    onCloseModal2 = ()=>{
        this.setState({openModal2 : false})
    }
    setValue = e => {
        this.setState({openModal1: false, openModal2: false});
    };

    render(){
        const {following, follower} = this.props;
        
        return(
            <div>
                <button onClick={this.onClickButton1} className="btn btn-raised btn-primary btn-rounded mr-5">{follower.length} Followers</button>
                <button onClick={this.onClickButton2} className="btn btn-raised btn-primary btn-rounded">{following.length} Followings</button>
                <Modal open={this.state.openModal1} onClose={this.onCloseModal1} style={{width:"1000px"}}>
                    <h1 className="mt-4">User's Followers List</h1>
                    <hr />
                    {follower.map((person,i) => {
                        return(
                        <div key={i}>
                            <div className="row">
                                <div>
                                    <Link to={`/user/${person._id}`} onClick={this.setValue}>
                                        <img
                                            className = "float-left mr-2 mt-2"
                                            height="100px"
                                            src={`${process.env.REACT_APP_API}/user/photo/${person._id}`}
                                            onError = {i=> (i.target.src = `${DefaultProfile}`)}
                                            alt={person.name} />
                                            <div>
                                            <p className="lead text-dark font-weight-bold">{person.name}</p>
                                            </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                    
                </Modal>  
                <Modal open={this.state.openModal2} onClose={this.onCloseModal2} style={{width:"1000px"}}>
                <h1 className="mt-4">User's Following List</h1>
                    <hr />
                    {following.map((person,i) => {
                        return(
                        <div key={i}>
                            <div className="row">
                                <div>
                                    <Link to={`/user/${person._id}`} onClick={this.setValue}>
                                        <img
                                            className = "float-left mr-2 mt-2"
                                            height="100px"
                                            src={`${process.env.REACT_APP_API}/user/photo/${person._id}`}
                                            onError = {i=> (i.target.src = `${DefaultProfile}`)}
                                            alt={person.name} />
                                            <div>
                                            <p className="lead text-dark font-weight-bold">{person.name}</p>
                                            </div>
                                    </Link>
                                    
                                </div>

                            </div>
                        </div>
                        );
                    })}
                </Modal>  
            </div>
        )
    }
}

export default ProfileTabs;



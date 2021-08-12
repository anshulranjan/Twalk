import {Component, React} from "react";
import { singlePost, like, unlike } from "./apiPost";
import DefaultProfile from "../images/user-avatar.png";
import { isAuthenticated } from '../auth/Index';
import { Link, Redirect} from "react-router-dom";
import {remove} from "./apiPost";
import Comment from "./Comment";
class SinglePost extends Component{

    state = {
        post: {likes:[] },
        redirectToProfile: false,
        loading: true,
        redirecttoSign: false,
        userid: '',
        like:false,
        likes: 0,
        comments : []
    };
    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };
    componentDidMount = () => {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    userid: data.postedBy,
                    loading: false,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    };
    updateComments = comments => {
        this.setState({comments});
    }
    likeToggle = () => {
        if(!isAuthenticated())
        {
            this.setState({redirecttoSign: true});
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const postId = this.props.match.params.postId;
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({like : !this.state.like, likes: data.likes.length})

            }

        })
    };
    deleteAccount = () =>{
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId,token).then(data =>{
            if(data.error)
            {
                console.log(data.error);
            } else {
                this.setState({redirectToProfile: true});
                
            }
        })
    };
    deleteConfirmed = () =>{
        let answer = window.confirm("Are you sure to delete your account?");
        if(answer)
        {
            this.deleteAccount();
        }
    }
    render(){
        const {post, loading, redirectToProfile, userid, like, likes, redirecttoSign, comments} = this.state;
        const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";
        const photoUrl = post.postedBy ? `${process.env.REACT_APP_API_URL}/user/photo/${post.postedBy._id}?${new Date().getTime()}` : DefaultProfile;
        if(redirectToProfile)
        {
            return (<Redirect to={`/user/${post.postedBy._id}`} />);
        }else if(redirecttoSign)
        {
            return (<Redirect to={`/signin`} />);
        }
        return(
            <section style={{"background-color": "#eee"}}>
                <div className="container my-5 py-5">
                    <div className="row d-flex justify-content-center">
                    <div className="col-md-12 col-lg-10 col-xl-8">
                        <div className="card">
                        <div className="card-body">
                        {loading ? (<div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                                </div>) : ("")}
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
                            {isAuthenticated() && userid._id === isAuthenticated().user._id && (
                                <div className="d-inline-block">
                                    <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-warning btn-sm mr-5 mb-3">
                                        Update Post
                                    </Link>
                                    <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger btn-sm mb-3">
                                        Delete Post
                                    </button>
                                </div>
                            )}
                            {isAuthenticated() && (
                            <>
                            <div className="small d-flex justify-content-start">
                                {like ? (
                                        <h3 onClick={this.likeToggle}>
                                        <i
                                            className="fa fa-thumbs-up text-primary"
                                            style={{ padding: "10px", borderRadius: "50%" }}
                                            />{" "}
                                            {likes} Likes
                                            </h3>
                                            ) : (
                                            <h3 onClick={this.likeToggle}>
                                                <i
                                                    className="fa fa-thumbs-up text-light"
                                                    style={{ padding: "10px", borderRadius: "100%", borderWidth:"10px", textShadow: "0 0 3px #000" }}
                                                />{" "}
                                                {likes} Likes
                                                </h3>
                                            )}
                            </div>
                            <Comment postId={post._id} comments={comments} updateComments = {this.updateComments}/>
                            </>
                            )}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>
        )
    }
}

export default SinglePost;


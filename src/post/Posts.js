import {Component, React} from "react";
import { list } from "./apiPost";
import DefaultProfile from "../images/user-avatar.png";
import { isAuthenticated } from "../auth/Index";
import { Link } from "react-router-dom";
class Posts extends Component{
    constructor(){
        super();
        this.state ={
            posts: [],
            loading: true,
            page: 1
        }
    }
    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };
    loadPosts = page => {
        list(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data, loading: false });
            }
        });
    };
    loadMore = number => {
        this.setState({ page: this.state.page + number, loading: true });
        this.loadPosts(this.state.page + number);
    };
 
    loadLess = number => {
        this.setState({ page: this.state.page - number, loading: true });
        this.loadPosts(this.state.page - number);
    };
    componentDidMount(){
        this.loadPosts(this.state.page);
    }
    renderPosts = (posts) => {
        return(
                    <>
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
                                                    {post.likes.length}
                                                    </h3>
                                                    ) : (
                                                    <h3 className="d-flex align-items-center me-3">
                                                        <i
                                                            className="fas fa-thumbs-up text-light"
                                                            style={{ padding: "10px", borderRadius: "100%", borderWidth:"10px", textShadow: "0 0 3px #000" }}
                                                        />{" "}
                                                        {post.likes.length}
                                                        </h3>
                                                    )}
                                        <h3 className="d-flex align-items-center me-3">
                                            <i className="fa fa-comment text-dark bg-white"
                                            style={{ padding: "10px", borderRadius: "50%" }}
                                            ></i>
                                            {" "}
                                            {post.comments.length}
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
                </>
            )
    }
    render(){
        const {posts, loading, page} = this.state;
        
        return(
            <div className="container">
                <h1 className="mt-5 mb-5 text-center">Recent Posts</h1>
                {loading ? (<div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
                    </div>) : ("")}
                {this.renderPosts(posts)}
                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}
                {posts.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>

        )
    }
}
export default Posts;





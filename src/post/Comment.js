import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth/Index";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/user-avatar.png";

class Comment extends Component {
    state = {
        text: "",
        error: ""
    };
    handleChange = event => {
        this.setState({ error: "" });
        this.setState({ text: event.target.value });
    };
    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 150) {
            this.setState({
                error:
                    "Comment should not be empty and less than 150 characters long"
            });
            return false;
        }
        return true;
    };
    addComment = e => {
        e.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: "Please signin to leave a comment" });
            return false;
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;

            comment(userId, token, postId, { text: this.state.text }).then(
                data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({ text: "" });
                        // dispatch fresh list of coments to parent (SinglePost)
                        this.props.updateComments(data.comments);
                    }
                }
            );
        }
    };
    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteConfirmed = comment => {
        let answer = window.confirm(
            "Are you sure you want to delete your comment?"
        );
        if (answer) {
            this.deleteComment(comment);
        }
    };

    render() {
        const {error} = this.state;
        const { comments } = this.props;
        return(
            <div>
                <div className="alert alert-danger mt-3" style={{display: error? "":"none"}}>{error}</div>
                <div class="card-footer py-3 border-0 mb-3" style={{"background-color": "#f8f9fa"}}>
                    <div class="d-flex flex-start w-100">
                    {isAuthenticated().user._id && (<img
                        class="rounded-circle shadow-1-strong me-3"
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${isAuthenticated().user._id}`}
                        alt={isAuthenticated().user.name}
                        onError={i =>
                            (i.target.src = `${DefaultProfile}`)
                            }
                        width="40"
                        height="40"
                    /> )}
                    <form class="form-outline w-100" onSubmit={this.addComment}>
                        <textarea
                        class="form-control"
                        onChange={this.handleChange}
                        value={this.state.text}
                        id="textAreaExample"
                        rows="4"
                        style={{"background": "#fff"}}
                        ></textarea>
                        <label class="form-label" for="textAreaExample">Comment...</label>
                        <div class="float-end mt-2 pt-1">
                        <button type="submit" class="btn btn-primary btn-sm">Post comment</button>
                        </div>
                    </form>
                </div>
                </div>
                <div className="col-md-12">
                    <h3 className="text-primary">{comments.length} Comments</h3>
                    <hr />
                    <div className="row">
                    <div className="col">
                    {comments.reverse().map((comment, i) => (
                        <div className="d-flex flex-start mb-4" key={i}>
                        <img
                          className="rounded-circle shadow-1-strong me-3"
                          height="65"
                          width="65"
                          onError={i =>
                                  (i.target.src = `${DefaultProfile}`)
                                  }
                          src={`${
                              process.env.REACT_APP_API_URL
                              }/user/photo/${comment.postedBy._id}`}
                              alt={comment.postedBy.name}
                          />
                          <div className="flex-grow-1 flex-shrink-1">
                              <div>
                              <div className="d-flex justify-content-between align-items-center">
                              <p className="mb-1">
                              <Link to={`/user/${comment.postedBy._id}`}> {comment.postedBy.name}{" "} </Link>
                                <span className="small">- {" "}{new Date(comment.created).toDateString()}</span>
                              </p>
                              {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                                                          <>
                                                              <span
                                                                  onClick={() =>
                                                                      this.deleteConfirmed(
                                                                          comment
                                                                      )
                                                                  }
                                                                  
                                                                  className="text-danger nav-link float-right mr-1"
                                                              >
                                                                  Remove
                                                                  </span>
                                                          </>
                                                      )}
              
                            </div>
                            <p className="mb-0">
                            {comment.text}
                            </p>
                          </div>
                          </div>
                          </div>
                    ))}
                    </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Comment;





           

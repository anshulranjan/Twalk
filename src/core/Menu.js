import React from "react";
import {Link, withRouter} from "react-router-dom";
import {signout, isAuthenticated} from '../auth/Index'

const isActive = (history, path) => {
    if(history.location.pathname === path)
    {
        return {color:"white"};
    }
    else
    {
        return {color: "grey"};
    }
}
const Menu = ({history}) =>(
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <i className="fas fa-bars"></i>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link to="/" className="navbar-brand" >TWALK</Link>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link to="/users" className="nav-link" style ={isActive(history, "/users")} aria-current="page">Users</Link>
                </li>

                <li className="nav-item">
                        <Link to = "/create/post" className="nav-link" style ={isActive(history, "/create/post")} aria-current="page"> 
                            Create Post
                        </Link>
                        </li>
                {!isAuthenticated() && (
                    <>
                        <li className="nav-item">
                        <Link to="/signin" className="nav-link" style ={isActive(history, "/signin")} aria-current="page">Sign In</Link>
                        </li>
                        <li className="nav-item">
                        <Link to="/signup" className="nav-link" style ={isActive(history, "/signup")} aria-current="page">Sign Up</Link>
                        </li>
                    </>
                )}
                {isAuthenticated() && (
                    <>

                        <li className="nav-item">
                        <Link to = {`/user/${isAuthenticated().user._id}`} className="nav-link" style ={isActive(history, `/user/${isAuthenticated().user._id}`)} aria-current="page"> 
                            {`${isAuthenticated().user.name}'s Profile`}
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to = {`/findpeople`} className="nav-link" style ={isActive(history, `/findpeople`)} aria-current="page"> 
                            People You May Know
                        </Link>
                        </li>
                        <li className="nav-item">
                        <span className="nav-link" onClick={() => signout(() => history.push("/"))} style ={isActive(history, "/signup"), {cursor:"pointer", color:"grey"}} aria-current="page">Sign Out</span>
                        </li>
                    </>
                )}
            </ul>
            </div>
        </div>
        </nav>
    </div>
)

export default withRouter(Menu);

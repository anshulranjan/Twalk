import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from './core/Home';
import Signup from "./users/Signup";
import Menu from "./core/Menu";
import Signin from "./users/Signin";
import Profile from "./users/Profile";
import FindPeople from "./users/FindPeople";
import SinglePost from "./post/SinglePost";
import Users from "./users/Users";
import EditProfile from "./users/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import NewPost from "./post/NewPost"
import ForgotPassword from "./users/ForgotPassword";
import ResetPassword from "./users/ResetPassword";
import EditPost from "./post/EditPost";
const MainRouter = () => (
    <div>
        <Menu></Menu>
        <Switch>
            <Route exact path="/" component = {Home}></Route>
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password/:resetPasswordToken" component={ResetPassword}/>
            <Route exact path="/post/:postId" component = {SinglePost}></Route>
            <PrivateRoute exact path="/post/edit/:postId" component = {EditPost}></PrivateRoute>
            <Route exact path="/signup" component = {Signup}></Route>
            <Route exact path="/signin" component = {Signin}></Route>
            <PrivateRoute exact path="/user/:userId" component = {Profile}></PrivateRoute>
            <Route exact path="/users" component = {Users}></Route>
            <PrivateRoute exact path="/user/edit/:userId" component = {EditProfile}></PrivateRoute>
            <PrivateRoute exact path="/findpeople" component = {FindPeople}></PrivateRoute>
            <PrivateRoute exact path="/create/post" component = {NewPost}></PrivateRoute>
        </Switch>
    </div>
)
export default MainRouter;
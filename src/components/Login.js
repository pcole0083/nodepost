//library imports
import React from 'react';
import ReactDOM from 'react-dom';

import * as API from '../api';
import * as AppDispatcher from '../dispatchers/AppDispatcher';
import LoginStatus from '../helpers/LoginStatus';

export default class Login extends React.Component {
    state = {
        user: {},
        message: null
    }

    componentDidMount() {
        if(!!this.props.user && !!this.props.user.username) {
            return this.setState({
                user: this.props.user,
                message: null
            });
        }
        LoginStatus.userCheck();
    }

    componentWillUpdate(){
        if(!!this.props.user && !!this.props.user.username){
            return;
        }
        let userData = this.getAuth();

        if(userData){
            API.auth.getUser(userData.uid, this.updateUser);
        }
    }

    userCheck = () => {
        let userData = this.getAuth();
        if(userData){
            return this.getUser(userData);
        }
        return userData;
    }

    getAuth = () => {
        return API.ref.getAuth();
    }

    getUser = (userData) => {
        return API.auth.getUser(userData.uid, this.updateUser);
    }

    updateUser = (snapshot) => {
        let user = snapshot.exportVal();

        var statusChanged = user.username !== this.state.user.username;

        if(statusChanged && user && user.username){
            this.setState({
                user: user,
                message: null
            });
            
            AppDispatcher.dispatcher.dispatch({
                actionType: 'status-login',
                isLoggedIn: true
            });
        }
    }

    render() {
        if (!!this.state.user && !!this.state.user.username)
            return <div className='row'>
                <p> Hello {this.state.user.username}! </p>
                <p> <button onClick={this.signout}> Sign Out </button> </p>
            </div>;

        return <div className='row'>
            <p>{this.state.message}</p>
            <p> <input className='u-full-width' placeholder='Username' ref='email' type='text' onKeyUp={this.enter} /></p>
            <p> <input className='u-full-width' placeholder='Password' ref='password' type='password' onKeyUp={this.enter} /></p>
            <p>
                <button onClick={this.signin}> Sign In </button>
                <button onClick={this.signup}> Sign Up </button>
            </p>
        </div>;
    }
    enter  = evt => {
        let key = evt.keyCode; //new versions of React my need to use key or charCode
        if( key !== 13 ){
            return;
        }
        this.sign('in', evt);
    }
    signin = evt => this.sign('in', evt);
    signup = evt => this.sign('up', evt);
    sign = (name, evt) => {
        var scope = this;

        var dEmail = ReactDOM.findDOMNode(this.refs.email),
            email = dEmail.value,
            password = ReactDOM.findDOMNode(this.refs.password).value;

        var signMethods = {
            "up": "createUser",
            "in": "authWithPassword"
        };

        API.ref[signMethods[name]]({
          email    : email,
          password : password
        },
        function(error, userData) {
          if (error) {

            scope.setState({
                user: scope.user,
                message: error.message
            });

            if(!!dEmail.focus){
                dEmail.focus();
            }
          }
          else {

            let uid = userData.uid;

            if(name === 'up'){
                API.auth.setUser(uid)
                scope.sign('in', evt);
            }
            else if(name === 'in'){

                API.auth.getUser(uid, function(snapshot){
                    let user = snapshot.exportVal();

                    scope.setState({
                        user: user,
                        message: null
                    });

                    AppDispatcher.dispatcher.dispatch({
                        actionType: 'status-login',
                        isLoggedIn: true
                    });
                });
            }
          }
        });
    }
    signout = evt => {
        API.ref.unauth();

        this.setState({
            user: {},
            message: "You have been logged out."
        });

        AppDispatcher.dispatcher.dispatch({
            actionType: 'status-logout',
            isLoggedIn: false
        });
    };
}

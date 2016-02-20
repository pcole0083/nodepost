//library imports
import React from 'react';
import ReactDOM from 'react-dom';

import * as API from '../api';
import * as LoginStatus from './LoginStatus';

export default class Login extends React.Component {
    state = {
        user: {},
        message: null
    }

    componentDidMount() {
        let userData = API.ref.getAuth();
        if(userData){
            API.auth.getUser(userData.uid, this.updateUser);
        }
    }

    componentWillUpdate(){
        if(!!this.props.user && !!this.props.user.username){
            return;
        }
        let userData = API.ref.getAuth();

        if(userData){
            API.auth.getUser(userData.uid, this.updateUser);
        }
    }

    updateUser = (snapshot) => {
        let user = snapshot.exportVal();

        var statusChanged = user.username !== this.state.user.username;

        if(statusChanged && user && user.username){
            this.setState({
                user: user,
                message: null
            });
            
            this.props.dispatcher.dispatch.call(this.props.dispatcher, {
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
            <p> <input className='u-full-width' placeholder='Username' ref='email' type='text' /></p>
            <p> <input className='u-full-width' placeholder='Password' ref='password' type='password' onKeypress={this.enter} /></p>
            <p>
                <button onClick={this.signin}> Sign In </button>
                <button onClick={this.signup}> Sign Up </button>
            </p>
        </div>;
    }
    enter  = evt => {
        if( evt.charCode !== 13 ){
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

                    scope.props.dispatcher.dispatch.call(scope.props.dispatcher, {
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

        this.props.dispatcher.dispatch.call(this.props.dispatcher, {
            actionType: 'status-logout',
            isLoggedIn: false
        });
    };
}
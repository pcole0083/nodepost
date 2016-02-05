//library imports
import React from 'react';
import {Link} from 'react-router';
//custom imports
import * as API from '../api';
import * as LoginStatus from './LoginStatus';
import ListItemWrapper from './ListItemWrapper';
import isAdmin from './isAdmin';

const auth = API.auth;

export default class Admin extends React.Component {

    state = { user: {}, groups: {} }

    componentDidMount() {
        let userData = API.ref.getAuth();
        if(userData) {
            auth.getUser(userData.uid, this.updateContent);
        }
        else {
            this.setState({
                user: {},
                groups: {}
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        let userData = API.ref.getAuth();
        if(userData) {
            API.auth.getUser(userData.uid, this.updateContent);
        }
        else {
            this.setState({
                user: {},
                groups: {}
            });
        }
    }

    updateContent = (snapshot) => {
        let json = snapshot.exportVal();
        this.setState({
            user: json,
            groups: json.groups || {}
        });
    }

    isAdmin(userGroups) {
        return isAdmin(userGroups);
    }

    render() {
        let groups = '';
        let isAdmin = false;

        if (!!this.state.user && !!this.state.user.username){
            if(!!this.state.groups) {
                isAdmin = this.isAdmin(this.state.groups); 
            }

            if(isAdmin) {
                return <div className="adminbar">
                    <div className='row'>
                        <div className="four columns">
                            <Link to="/" className="admin-account-home">Home</Link>
                            <span className="bar-title">&nbsp;</span>
                            <Link to="/menus" className="bar-title">Menu Editor</Link>
                            <span className="bar-title">&nbsp;</span>
                            <span className="bar-title">Admin Bar</span>
                        </div>
                        <div className="four columns">
                            <button className="admin-new-post"><Link to="/new"><i className="icon-plus-squared-alt"></i>New</Link></button>
                        </div>
                        <div className="four columns">
                            <Link to="/account" className="admin-account-link">Welcome {this.state.user.username}</Link>
                        </div>
                    </div>
                </div>;
            }
        }
        return <div className="hidden"></div>;
    }
}
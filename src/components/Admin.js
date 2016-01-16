//library imports
import React from 'react';
import {Link} from 'react-router';
//custom imports
import * as API from '../api';
import ListItemWrapper from './ListItemWrapper';

export default class Admin extends React.Component {

    state = { user: {} }

    componentDidMount() {
        if(!!this.props.user && !!this.props.user.username){
            API.users.child(this.props.user.username).on('value', this.updateContent);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!!this.props.user && !!this.props.user.username){
            API.users.child(this.props.user.username).off('value', this.updateContent);
        }
        if(!!nextProps && !!nextProps.user && !!nextProps.user.username){
            API.users.child(nextProps.user.username).on('value', this.updateContent);
        }
    }

    updateContent = (snapshot) => {
        let json = snapshot.exportVal();
        this.setState({
            user: json,
            groups: json.groups || {}
        });
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
                            <span className="bar-title">Admin Menu Bar</span>
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

    isAdmin(userGroups) {
        return Object.keys(userGroups).filter(function(id) {
            return userGroups[id] === 'admins';
        });
    }
}
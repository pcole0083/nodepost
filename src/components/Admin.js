//library imports
import React from 'react';
import {Link} from 'react-router';
//custom imports
import * as API from '../api';
import * as LoginStatus from '../helpers/LoginStatus';
import ListItemWrapper from './ListItemWrapper';
import isAdmin from './isAdmin';

const auth = API.auth;

export default class Admin extends React.Component {

    state = {
        user: {},
        groups: {}
    }

    componentDidMount() {
        //auth.getUser(userData.uid, this.updateContent);
        let groups = this.props.user && this.props.user.groups ? this.props.user.groups : {};

        this.setState({
            user: this.props.user || this.state.user,
            groups: groups
        });
    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps.user && (this.props.user.username !== nextProps.user.username) ){
            let groups = nextProps.user.groups || {};

            this.setState({
                user: nextProps.user,
                groups: groups
            });
        }
    }

    componentWillUpdate(){
        let user = this.state.user;
        let groups = this.state.groups;

        if(!!this.props.user && !!this.props.user.groups && this.props.user.username !== this.state.user.username){
            user = this.props.user;
            groups = this.props.user.groups

            this.setState({
                user: user,
                groups: groups
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

    toggleOpen = evt => {
        var adminBar = React.findDOMNode(this.refs.adminbar);
        adminBar.classList.toggle('open-slide');
    }

    render() {
        let groups = '';
        let isAdmin = false;

        if (!!this.state.user && !!this.state.user.username){
            if(!!this.state.groups) {
                isAdmin = this.isAdmin(this.state.groups);
            }

            if(isAdmin) {
                return <div className="adminbar" ref="adminbar">
                    <div className='row'>
                        <div className="ten columns">
                            <Link to="/account" className="admin-account-link">Welcome {this.state.user.username}</Link>
                        </div>
                        <div className="two columns">
                            <i className="icon-cog toggle-switch" onClick={this.toggleOpen} ></i>
                        </div>
                    </div>
                    <div className='row'>
                        <div className="tweleve columns">
                            <button className="admin-new-post"><Link to="/new"><i className="icon-plus-squared-alt"></i>New</Link></button>
                        </div>
                        <div className="tweleve columns">
                            <Link to="/" className="admin-account-home">Home</Link>
                            <Link to="/menus" className="bar-title">Menu Editor</Link>
                            <Link to="/posts" className="bar-title"><i className="icon-pencil-squared"></i>Posts</Link>
                            <span className="bar-title"><i className="icon-user"></i>Users</span>
                            <span className="bar-title"><i className="icon-database"></i>Settings</span>
                        </div>
                    </div>
                </div>;
            }
        }
        return <div className="hidden"></div>;
    }
}
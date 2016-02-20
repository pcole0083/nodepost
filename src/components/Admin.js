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
        console.log("Admin nextProps");
        console.log(nextProps);
        if(!!nextProps.user && (this.props.user.username !== nextProps.user.username) ){
            let groups = nextProps.user.groups || {};

            this.setState({
                user: nextProps.user,
                groups: groups
            });
        }
    }

    componentWillUpdate(){
        console.log("Admin will update:");
        console.log(this.props);

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

    // registerLogout(){
    //     var LoggoutToken = this.props.dispatcher.register({}, (payload) => {
    //         console.log("payload:");
    //         console.log(payload);
    //         if (payload.actionType === 'status-loggout') {
    //             this.setState({
    //                 user: {},
    //                 groups: {}
    //             });
    //             this.props.dispatcher.unregister(LoggoutToken);
    //         }
    //     });
    // }

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
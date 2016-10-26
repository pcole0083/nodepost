//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
import isAdmin from '../helpers/isAdmin';
import {userCheck} from '../helpers/LoginStatus';
import ListItemWrapper from './ListItemWrapper';

export default class Users extends React.Component {
    state = {
        user: this.props.user,
        groups: this.props.user.groups,
        all_users: [],
        all_groups: []
    };

    componentDidMount() {
        this.updateState();
    };

    componentWillUnmount(){
        API.users.off('value');
        API.groups.off('value');
        if(!!this.cleanup){
            this.cleanup()
        }
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if(JSON.stringify(this.state.settings) === JSON.stringify(nextState.settings)){
    //         return false;
    //     }
    //     return true;
    // }

    // componentWillReceiveProps(nextProps) {
    //     if(!!nextProps.user && (this.props.user.username !== nextProps.user.username) ){
    //         let groups = nextProps.user.groups || {};

    //         this.updateState(nextProps.user, groups);
    //     }
    // }

    componentWillUpdate(){
        let user = this.state.user;
        let groups = this.state.groups;

        if(!!this.props.user && !!this.props.user.groups && this.props.user.username !== this.state.user.username){
            user = this.props.user;
            groups = this.props.user.groups

            this.updateState(user, groups);
        }
    }

    render() {
        let canViewPage = false;

        if (!!this.state.user && !!this.state.user.username){
            if(!!this.state.groups) {
                canViewPage = isAdmin(this.state.groups);
            }

            if(canViewPage) {
                let all_users = Object.keys(this.state.all_users).map((index) => {
                    let user = this.state.all_users[index];
                    let groups = Object.keys(user.groups).map((id) => {
                        return <button className="btn" key={id} data-uid={index} data-gid={id} onClick={this.removeFromGroup}><span>{user.groups[id]} <i className="icon-cancel-squared"></i></span></button>;
                    });

                    return <li key={"user-"+index} className="user-row">
                        <div className="row">
                            <div className="three columns">{user.username}</div>
                            <div className="three columns">{groups}</div>
                            <div className="three columns">{""+!!~groups.indexOf('admins')}</div>
                            <div className="three columns"><button className="btn"><span>Delete </span><i className="icon-cancel-squared"></i></button></div>
                        </div>
                    </li>;
                });

                let heading = <li key="userHeadingGroup" className="headingGroup">
                    <div className="row">
                        <div className="three columns">Username</div>
                        <div className="three columns">Groups</div>
                        <div className="three columns">Is Admin</div>
                        <div className="three columns">Manage</div>
                    </div>
                </li>;
                all_users.unshift(heading);

                let all_groups = Object.keys(this.state.all_groups).map((index) => {
                    let group = this.state.all_groups[index];
                    let keyRef = "group-"+index;
                    let value = ""+group;
                    let disabled = value === 'admins' ? 'disabled' : '';
                    let btn = disabled === 'disabled' ? <button className="btn"><span>Locked </span><i className="icon-lock"></i></button> : <button className="btn" onClick={this.updateGroup} data-fieldref={keyRef} ><span>Update </span><i className="icon-check"></i></button>;
                    let del = disabled === 'disabled' ? ' ' : <button className="btn"><span>Delete </span><i className="icon-cancel-squared"></i></button> ;
                    
                    return <li key={keyRef} className="group-row">
                        <div className="row">
                            <div className="three columns">
                                <input type="text" ref={keyRef} data-index={index} defaultValue={value} data-saved={value} disabled={disabled} />
                            </div>
                            <div className="three columns">{btn}</div>
                            <div className="three columns">&nbsp;</div>
                            <div className="three columns">{del}</div>
                        </div>
                    </li>;
                });

                let add_group = <li key="addGroupRow" className="group-row">
                    <div className="row">
                        <div className="three columns">
                            <input type="text" ref="newGroup" data-index="-1" defaultValue="" />
                        </div>
                        <div className="three columns">
                            <button className="btn" onClick={this.addGroup} data-fieldref="newGroup"><span>Add Group </span><i className="icon-plus-squared"></i></button>
                        </div>
                    </div>
                </li>;

                all_groups.push(add_group);

                return <article className="post-article admin-settings">
                    <h2>Site Users</h2>
                    <ul className="settings-group">
                        {all_users}
                    </ul>
                    <hr />
                    <h2>User Groups</h2>
                    <ul className="settings-group">
                        {all_groups}
                    </ul>
                </article>;
            }
        }
        return <div className="hidden"></div>;
    };

    updateState = (user, groups) => {
        if(API.users){
            user = !!user ? user : this.state.user;
            groups = !!groups ? groups : this.state.groups;

            //API.settings.off('value');
            API.users.once('value', ss => {
                let json = ss.exportVal() || {};

                API.groups.once('value', sg => {
                    let gson = sg.exportVal() || {};

                    this.setState({
                        all_users: json,
                        user: user,
                        groups: groups,
                        all_groups: gson
                    });
                });
            });
        }
    }

    updateGroup = evt => {
        let ele = evt.target;

        if(ele.nodeName.toLowerCase() !== 'button'){
            ele = evt.target.parentNode;
        }

        let all_users = this.state.all_users,
            keyRef = ele.getAttribute('data-fieldref'),
            input  = ReactDOM.findDOMNode(this.refs[keyRef]),
            value  = input.value,
            saved  = input.getAttribute('data-saved'),
            index  = input.getAttribute('data-index');

        if(!!index && !!value && saved !== 'admins') {
            API.groups.child(index).set(value);
            Object.keys(all_users).map((i) => {
                let user = all_users[i];
                let userInGroup = Object.keys(user.groups).map((ugid) => {
                    let ugroup = user.groups[ugid];
                    if(ugroup === saved){
                        return ugroup;
                    }
                });

                if(!!userInGroup[0]){
                    API.users.child(i+'/groups/'+index).set(value);
                }
            });
            this.updateState();
        }
    }

    addGroup = evt => {
        let ele = evt.target;

        if(ele.nodeName.toLowerCase() !== 'button'){
            ele = evt.target.parentNode;
        }

        let groups = this.state.all_groups,
            keyRef = ele.getAttribute('data-fieldref'),
            input  = ReactDOM.findDOMNode(this.refs[keyRef]),
            value  = input.value;

        let groupExists = Object.keys(groups).filter((key) => {
            let groupName = groups[key];
            if(groupName === value){
                return key;
            }
        })[0];

        if(!!groupExists){
            return;
        }

        if(!groupExists){
            API.groups.push(value, () => {
                this.updateState();
                input.value = "";
            });
        }
    }

    addToGroup = evt => {
        let ele = evt.target;

        
    }

    removeFromGroup = evt => {
        let ele = evt.target;

        if(ele.nodeName.toLowerCase() !== 'button'){
            ele = evt.target.parentNode;
        }

        let uid = ele.getAttribute('data-uid'),
            gid = ele.getAttribute('data-gid'),
            user = this.state.all_users[uid];

        API.users.child(uid+'/groups/'+gid).remove((err) => {
            if(err){
                return console.table(err);
            }
            else {
                this.updateState();
            }
        });
    }

    updateUsers = evt => {
        var ele = evt.target;
        var updatedSetting = ele.name,
            updatedVal = ele.value;
        console.log(ele);
    }
};

Users.contextTypes = {
    router: React.PropTypes.func.isRequired
};

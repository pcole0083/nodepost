//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
import isAdmin from '../helpers/isAdmin';
import {userCheck} from '../helpers/LoginStatus';
import SelectBox from './SelectBox';

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

                let all_groups = this.state.all_groups;
                let all_users = Object.keys(this.state.all_users).map((index) => {
                    let user = this.state.all_users[index];
                    let current_groups = Object.keys(user.groups).map((id) => {
                        return <button className="btn" key={id} data-uid={index} data-gid={id} onClick={this.removeUserFromGroup}><span>{user.groups[id]} </span><i className="icon-cancel-squared"></i></button>;
                    });

                    let options = Object.keys(all_groups).map((group_id) => {
                        return {
                            value: group_id,
                            label: all_groups[group_id]
                        };
                    });

                    let data = {
                        id: 'selectUser-'+index,
                        placeholder: null,
                        options: options
                    };

                    let delete_user_btn = isAdmin(user.groups) ? null : <div className="three columns" title="Delete User"><button className="btn"><span>Delete </span><i className="icon-cancel-squared"></i></button></div>;

                    return <li key={"user-"+index} className="user-row">
                        <div className="row">
                            <div className="three columns" title="Username">{user.username}</div>
                            <div className="three columns" title="Groups">{current_groups}</div>
                            <div className="three columns" title="Add Group">
                                <SelectBox data={data} />
                                <button className="btn" onClick={this.addUserToGroup} data-fieldref={'selectUser-'+index}><i className="icon-plus-squared"></i></button>
                            </div>
                            {delete_user_btn}
                        </div>
                    </li>;
                });

                let heading = <li key="userHeadingGroup" className="headingGroup hidden-mobile">
                    <div className="row">
                        <div className="three columns">Username</div>
                        <div className="three columns">Groups</div>
                        <div className="three columns">Add to Group</div>
                        <div className="three columns">Delete</div>
                    </div>
                </li>;
                all_users.unshift(heading);

                let all_groups_jsx = Object.keys(all_groups).map((index) => {
                    let group = all_groups[index];
                    let keyRef = "group-"+index;
                    let value = ""+group;
                    let disabled = value === 'admins' ? 'disabled' : '';
                    let btn = disabled === 'disabled' ? <button className="btn"><span>Locked </span><i className="icon-lock"></i></button> : <button className="btn" onClick={this.updateGroup} data-fieldref={keyRef} ><span>Update </span><i className="icon-check"></i></button>;
                    let del = disabled === 'disabled' ? ' ' : <button className="btn"><span>Delete </span><i className="icon-cancel-squared"></i></button> ;
                    
                    return <li key={keyRef} className="group-row">
                        <div className="row">
                            <div className="nine columns">
                                <input type="text" ref={keyRef} data-index={index} defaultValue={value} data-saved={value} disabled={disabled} />
                                {btn}
                            </div>
                            <div className="three columns">{del}</div>
                        </div>
                    </li>;
                });

                let add_group = <li key="addGroupRow" className="group-row">
                    <div className="row">
                        <div className="tweleve columns">
                            <input type="text" ref="newGroup" data-index="-1" defaultValue="" />
                            <button className="btn" onClick={this.addGroup} data-fieldref="newGroup"><span>Add <span className="hidden-mobile">Group</span> </span><i className="icon-plus-squared"></i></button>
                        </div>
                    </div>
                </li>;

                all_groups_jsx.push(add_group);

                return <article className="post-article admin-settings">
                    <h2>Site Users</h2>
                    <ul className="settings-group">
                        {all_users}
                    </ul>
                    <hr />
                    <h2>User Groups</h2>
                    <ul className="settings-group">
                        {all_groups_jsx}
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

    addUserToGroup = evt => {
        let ele = evt.target;

        if(ele.nodeName.toLowerCase() !== 'button'){
            ele = evt.target.parentNode;
        }

        let selectid = ele.getAttribute('data-fieldref'),
            select = !!selectid ? document.querySelector('#'+selectid): null,
            gid = select.value,
            groupName = this.state.all_groups[gid];

        let userid = selectid.replace('selectUser-', ''),
            selectedUser = this.state.all_users[userid];

        if(!!selectedUser.groups[gid]){
            return; //do nothing if the user already belongs to the group
        }

        API.users.child(userid+'/groups/'+gid).set(groupName, () => {
            this.updateState();
        });
    }

    removeUserFromGroup = evt => {
        let ele = evt.target;

        if(ele.nodeName.toLowerCase() !== 'button'){
            ele = evt.target.parentNode;
        }

        let uid = ele.getAttribute('data-uid'),
            gid = ele.getAttribute('data-gid'),
            user = this.state.all_users[uid];

        if(uid === this.state.user.uid && user.groups[gid] === "admins"){
            return;
        }

        API.users.child(uid+'/groups/'+gid).remove((err) => {
            if(err){
                return console.table(err);
            }
            else {
                this.updateState();
            }
        });
    }
};

Users.contextTypes = {
    router: React.PropTypes.func.isRequired
};

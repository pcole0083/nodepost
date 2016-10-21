//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
import isAdmin from '../helpers/isAdmin';
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
                        return user.groups[id];
                    });
                    return <li key={"user-"+index} className="user-row">
                        <div className="row">
                            <div className="three columns">{user.username}</div>
                            <div className="three columns">{groups.join(', ')}</div>
                            <div className="three columns">{""+!!~groups.indexOf('admins')}</div>
                            <div className="three columns"><i className="icon-cancel-squared"></i></div>
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
                    let del = disabled === 'disabled' ? ' ' : <i className="icon-cancel-squared"></i>;
                    
                    return <li key={keyRef} className="group-row">
                        <div className="row">
                            <div className="three columns">
                                <input type="text" ref={keyRef} data-index={index} defaultValue={value} disabled={disabled} />
                            </div>
                            <div className="three columns">{btn}</div>
                            <div className="three columns">&nbsp;</div>
                            <div className="three columns">{del}</div>
                        </div>
                    </li>;
                });

                return <article className="post-article admin-settings">
                    <h1>Site Users</h1>
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
                    // userKeys = Object.keys(json),
                    // users = userKeys.map((id) => {
                    //     return json[id];
                    // });

                API.groups.once('value', sg => {
                    let gson = sg.exportVal() || {};
                        // gKeys = Object.keys(gson),
                        // all_groups = gKeys.map((id) => {
                        //     return gson[id];
                        // });

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
        var ele = evt.target;

        if(ele.nodeName.toLowerCase() !== 'button'){
            ele = evt.target.parentNode;
        }

        var keyRef = ele.getAttribute('data-fieldref'),
            input  = ReactDOM.findDOMNode(this.refs[keyRef]),
            value  = input.value,
            index  = input.getAttribute('data-index');

        if(!!index && !!value) {
            API.groups.child(index).set(value);
            this.updateState();
        }
    }

    updateUsers = evt => {
        var ele = evt.target;
        var updatedSetting = ele.name,
            updatedVal = ele.value;
        console.log(ele);
    }

    // renderOptions(setting) {
    //     if(!setting || setting.type !== 'select-one'){
    //         return null;
    //     }

    //     return setting.value.map((val, id) =>
    //         <option key={id} value={setting.value[id].value} >{setting.value[id].label}</option>
    //     );
    // };
};

Users.contextTypes = {
    router: React.PropTypes.func.isRequired
};

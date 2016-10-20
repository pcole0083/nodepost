//library imports
import React from 'react';
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
        all_users: {}
    };

    componentDidMount() {
        this.updateState();
    };

    componentWillUnmount(){
        API.users.off('value');
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
                let all_users = this.state.all_users.map((user) => {
                    let groups = Object.keys(user.groups).map((id) => {
                        return user.groups[id];
                    });
                    let text = 'Username: '+user.username+'  |  Groups: '+groups.join(', ');
                    return <ListItemWrapper key={user.username} data={text} className="setting-item" />
                });
                return <article className="post-article admin-settings">
                    <h1>Site Users</h1>
                    <ul className="settings-group">
                        {all_users}
                    </ul>
                    <div className="submit-wrapper">
                        <button type="button" onClick={this.updateUsers}>Update Users</button>
                    </div>
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
                let json = ss.exportVal() || {},
                    userKeys = Object.keys(json),
                    users = userKeys.map((id) => {
                        return json[id];
                    });

                this.setState({
                    all_users: users,
                    user: user,
                    groups: groups
                });
            });
        }
    }

    // updateSetting = evt => {
    //     var ele = evt.target;
    //     var name = ele.name,
    //         type = ele.type,
    //         updatedVal = ele.value;

    //     var updatedSetting = Object.assign(this.state.settings[name], {type: type, label: ele.getAttribute('data-lbl'), value: updatedVal});

    //     this.updateState();
    //     API.settings.child(name).set(updatedSetting);
    // }

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

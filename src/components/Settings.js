//library imports
import React from 'react';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
import isAdmin from '../helpers/isAdmin';
import SettingsListItem from './SettingsListItem';

export default class Settings extends React.Component {
    state = {
        user: this.props.user,
        groups: this.props.user.groups,
        settings: {
            site_title: {
                type: 'text',
                label: 'Site Title',
                value: 'Nodepost'
            },
            tagline: {
                type: 'text',
                label: 'Tag Line',
                value: 'Just a ReactJS WordPress clone'
            },
            contact_email: {
                type: 'text',
                label: 'Contact Email',
                value: 'admin@example.com'
            },
            membership: {
                type: 'checkbox',
                label: 'Membership',
                value: ''
            },
            default_role: {
                type: 'select-one',
                label: 'New User Default Role',
                value: [
                    {
                        label: 'Subscriber',
                        value: 3
                    },
                    {
                        label: 'Contributor',
                        value: 2
                    },
                    {
                        label: 'Admin',
                        value: 1
                    }
                ]
            }
        }
    };

    componentDidMount() {
        this.updateState();
    };

    componentWillUnmount(){
        API.settings.off('value');
        if(!!this.cleanup){
            this.cleanup()
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(JSON.stringify(this.state.settings) === JSON.stringify(nextState.settings)){
            return false;
        }
        return true;
    }

    componentWillReceiveProps(nextProps) {
        console.log('next');
        if(!!nextProps.user && (this.props.user.username !== nextProps.user.username) ){
            let groups = nextProps.user.groups || {};

            this.updateState(nextProps.user, groups);
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
                let mysettings = Object.keys(this.state.settings).map(id => <SettingsListItem key={id+this.state.settings[id].value.toString().replace(/\s/gi, '_')} id={id} setting={this.state.settings[id]} className="setting-item" />);
                return <article className="post-article admin-settings">
                    <h1>Site Settings</h1>
                    <ul className="settings-group">
                        {mysettings}
                    </ul>
                    <div className="submit-wrapper">
                        <button type="button" onClick={this.updateSettings}>Update Settings</button>
                    </div>
                </article>;
            }
        }
        return <div className="hidden"></div>;
    };

    updateState = (user, groups) => {
        if(API.settings){
            user = !!user ? user : this.state.user;
            groups = !!groups ? groups : this.state.groups;

            //API.settings.off('value');
            API.settings.once('value', ss => {
                let json = ss.exportVal() || {},
                    settings = Object.assign(this.state.settings, json);

                this.setState({
                    settings: settings,
                    user: user,
                    groups: groups
                });

                this.forceUpdate();
            });
        }
    }

    updateSetting = evt => {
        var ele = evt.target;
        var name = ele.name,
            type = ele.type,
            updatedVal = ele.value;

        var updatedSetting = Object.assign(this.state.settings[name], {type: type, label: ele.getAttribute('data-lbl'), value: updatedVal});

        this.updateState();
        API.settings.child(name).set(updatedSetting);
    }

    updateSettings = evt => {
        var ele = evt.target;
        var updatedSetting = ele.name,
            updatedVal = ele.value;
        console.log(ele);
    }

    renderOptions(setting) {
        if(!setting || setting.type !== 'select-one'){
            return null;
        }

        return setting.value.map((val, id) =>
            <option key={id} value={setting.value[id].value} >{setting.value[id].label}</option>
        );
    };
};

Settings.contextTypes = {
    router: React.PropTypes.func.isRequired
};

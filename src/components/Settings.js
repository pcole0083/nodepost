//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
import isAdmin from '../helpers/isAdmin';

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
                label: 'Site Title',
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
        if(API.settings){
            API.settings.on('value', ss => this.setState({
                settings: ss.exportVal() || this.state.settings,
                user: this.props.user,
                groups: this.props.user.groups
            }));
        }
    };

    componentWillReceiveProps(nextProps) {
        if(!!nextProps.user && (this.props.user.username !== nextProps.user.username) ){
            let groups = nextProps.user.groups || {};

            this.setState({
                settings: this.state.settings,
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
                settings: this.state.settings,
                user: user,
                groups: groups
            });
        }
    }

    render() {
        let canViewPage = false;

        if (!!this.state.user && !!this.state.user.username){
            if(!!this.state.groups) {
                canViewPage = isAdmin(this.state.groups);
            }

            if(canViewPage) {
                let mysettings = Object.keys(this.state.settings).map(id => 
                    this.state.settings[id].type === 'select-one' ? 
                    <li key={id} className="setting-item"><label htmlFor={id}><span className="setting-label">{this.state.settings[id].label}</span><select defaultValue={this.state.settings[id].value[0]} >{this.renderOptions(this.state.settings[id])}</select></label></li>
                    :
                    <li key={id} className="setting-item"><label htmlFor={id}><span className="setting-label">{this.state.settings[id].label}</span><input type={this.state.settings[id].type} defaultValue={this.state.settings[id].value} /></label></li>
                );
                return <article className="post-article admin-settings">
                    <h1>Site Settings</h1>
                    <ul className="settings-group">
                        {mysettings}
                    </ul>
                </article>;
            }
        }
        return <div className="hidden"></div>;
    };

    // renderSettings(settings) {
    //     return settings.map(id =>
    //         <li key={id} className="setting-item">{settings[id]['label']}<li>
    //     );
    // };

    renderOptions(setting) {
        if(!setting || setting.type !== 'select-one'){
            return null;
        }
        console.log(setting);

        return setting.value.map((val, id) =>
            <option value={setting.value[id].value} >{setting.value[id].label}</option>
        );
    };
};

// Settings.contextTypes = {
//     router: React.PropTypes.func.isRequired
// };

                // if(setting.type === 'select-one'){
                //     <label for={id}><span className='setting-label'>{setting.label}</span><select className="settings-select">
                //         {renderOptions(setting)}
                //     </select></label>
                // }
                // else {
                    
                // }
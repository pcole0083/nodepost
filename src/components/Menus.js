//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
import ListItemWrapper from './ListItemWrapper';
import isAdmin from './isAdmin';

export default class Menus extends React.Component {
    state = { 
        user: {},
        groups: {}
    }

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
        let adminUser = '';

        if (!!this.state.user && !!this.state.user.username){
            if(!!this.state.groups) {
                adminUser = isAdmin(this.state.groups);
            }

            if(adminUser) {
                return <div className='row'>
                    <article>
                        <h1>Menus</h1>
                        <p>Edit menus here. On left will be collapsable list of pages, posts, categories, and custom links. On right is menu name / title and links added to the menu.</p>
                        <h2>User Groups</h2>
                        {groups}
                        <p><input className='add-group-input' placeholder='Add Group' ref='group' type='text' onKeyPress={this.onEnter} /></p>
                        <p><button onClick={this.addGroup}>Add Group</button></p>
                    </article>
                </div>;
            }
        }
        return <div className='row'></div>;
    }

    onEnter = evt => {
        if( evt.charCode !== 13 ){
            return;
        }
        this.add('group', evt);
    }
    addGroup = evt => this.add('group', evt);
    add = (name, evt) => {
        var username = this.props.user.username,
            group = ReactDOM.findDOMNode(this.refs.group).value;
        if( !this.exists('group', group) ){
            API.users.child(username+'/groups').push(group);
        }
    }
    exists(userProp, newProp) {
        let prop = this.props.user[userProp];

        if( !prop ){
            return false;
        }

        let filtered = Object.keys(prop).filter(function(key){
            return newProp === prop[key];
        });
        return filtered.length > 0;
    }
}
//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
import ListItemWrapper from './ListItemWrapper';
import isAdmin from '../helpers/isAdmin';

export default class Menus extends React.Component {
    state = { 
        user: {},
        groups: {},
        availableGroups: {}
    }

    componentDidMount() {
        let state = this.state || {};
        //auth.getUser(userData.uid, this.updateContent);
        if(!state.availableGroups){
            API.groups.orderByValue().on('value', this.updateContent);
        }
    }

    componentWillReceiveProps(nextProps) {
        let state = this.state || {};

        console.log("Menu nextProps");
        console.log(nextProps);

        if(!!nextProps.user && (this.props.user.username !== nextProps.user.username) ){
            let groups = nextProps.user.groups || {};

            this.setState({
                user: nextProps.user,
                groups: groups,
                availableGroups: state.availableGroups || {}
            });
        }
    }

    componentWillUpdate(){
        console.log("Menu will update");

        let state = this.state || {};

        console.log(state);

        let user = state.user || {};
        let groups = state.groups || {};
        let availableGroups = state.availableGroups || {};

        if(!!this.props.user && !!this.props.user.groups && this.props.user.username !== state.user.username){
            user = this.props.user;
            groups = this.props.user.groups

            this.setState({
                user: user,
                groups: groups,
                availableGroups: state.availableGroups || {}
            });
        }
    }

    updateContent = (snapshot) => {
        let json = snapshot.val();

        console.log("updateContent");
        console.log(json);

        let groups = this.props.user && this.props.user.groups ? this.props.user.groups : {};

        this.setState({
            user: this.props.user || {},
            groups: groups,
            availableGroups: json || {}
        });
    }

    render() {
        let state = this.state || {};
        let groups = '';
        let adminUser = '';

        console.log("render");
        console.log(this.state);

        if (!!state.user && !!state.user.username){
            if(!!state.groups) {
                adminUser = isAdmin(state.groups);
            }

            if(adminUser) {
                groups = Object.keys(state.groups).map(id => <ListItemWrapper key={id} data={state.groups[id]} /> );

                return <div className='row'>
                    <article>
                        <h1>Menus</h1>
                        <p>Edit menus here. On left will be collapsable list of pages, posts, categories, and custom links. On right is menu name / title and links added to the menu.</p>
                        <h2>User Groups</h2>
                        <ul>{groups}</ul>
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
            API.groups.push(group);
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
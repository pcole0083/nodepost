//library imports
import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
//custom imports
import * as API from '../api';
import ListItemWrapper from './ListItemWrapper';
import Login from './Login';

export default class Account extends React.Component {

    state = {
        user: {},
        groups: {}
    }

    componentDidMount() {
        if(!!this.props.user && !!this.props.user.username){
            this.updateUser(this.props.user);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.updateUser(nextProps);
    }

    updateUser = (json) => {
        this.setState({
            user: json || {},
            groups: !!json && json.groups || {}
        });
    }

    render() {
        let groups = '';
        if (!!this.props.user && !!this.props.user.username){
            if(!!this.props.user.groups) {
                let groupData = this.props.user.groups;
                groups = <ul className="group-names" >
                    {Object.keys(groupData).map(function(id) {
                        let link = {
                            to:   'group',
                            text: groupData[id]
                        };
                        return <li key={id} className='group-name icon-col'>
                            {link.text} <i className="icon-cancel-squared" data-id={id} ></i>
                        </li>;
                    })}
                </ul>;
            }

            return <article>
                    <h2>Account</h2>
                    <p>Hello {this.props.user.username}!</p>
                    <h2>User Groups</h2>
                    {groups}
                    <p><input className='add-group-input' placeholder='Add Group' ref='group' type='text' onKeyPress={this.onEnter} /></p>
                    <p><button onClick={this.addGroup}>Add Group</button></p>
                </article>;
        }
        return <article><div className='row'><Link to="/login">Login</Link></div></article>;
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
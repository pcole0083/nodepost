//library imports
import React from 'react';
import * as API from '../api';
import * as AppDispatcher from '../dispatchers/AppDispatcher';

export default class LogoutBtn extends React.Component {
    render() {
        if(!!this.props.user && !!this.props.user.username) {
            return <button onClick={this.signout} className={this.props.className}> Sign Out </button>;
        }
        return null;
    }
    signout = evt => {
        API.ref.unauth();

        AppDispatcher.dispatcher.dispatch({
            actionType: 'status-logout',
            isLoggedIn: false
        });
    };
}

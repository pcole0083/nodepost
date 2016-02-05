//library imports
import React from 'react';
import * as RR from 'react-router';
const {Link} = RR;
const {RouteHandler} = RR;
//custom imports
import * as API from '../api';
import * as LoginStatus from './LoginStatus';
import Login    from './Login';
import Postlist from './PostList';
import Account  from './Account';
import Home     from './Home';
import Admin    from './Admin';

class App extends React.Component {
	state = {
		user: USER
	}

    componentDidMount() {
        if(!!this.props && !!this.props.user && !!this.props.user.uid){
            API.users.child(this.props.user.uid).once('value', this.updateContent);
        }
        this.registerLogin.call(this);
    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps && !!nextProps.user && !!nextProps.user.uid){
            API.users.child(nextProps.user.uid).once('value', this.updateContent);
        }
    }

    componentDidUpdate(){
        console.log("HIT");
    }

    updateContent = (snapshot) => {
        let json = snapshot.exportVal();
        this.setState({
            user: json
        });
    }

    render() {
        return <div>
            <div className="row">
                <div className="three columns">
                    <h1><Link to="/">NodePost</Link></h1>
                </div>
                <div className="nine columns"></div>
            </div>
        	<div className="row">
        		<div className="three columns">
                    <Login user={this.state.user} dispatcher={LoginStatus.dispatcher} />
        			<Postlist user={this.state.user} />
        		</div>
        		<div className="nine columns">
        			<RouteHandler user={this.state.user} />
        		</div>
        	</div>
            <Admin user={this.state.user} dispatcher={LoginStatus.dispatcher} /> 
        </div>;
    }

    setUser = (user) => this.setState({ user: user })

    registerLogin(){
        var LoginToken = LoginStatus.register({}, (payload) => {
            if (payload.actionType === 'status-login') {
                let userData = API.ref.getAuth();
                if(!!userData) {
                    API.auth.getUser(userData.uid, (snapshot) => {
                        let user = snapshot.exportVal();

                        this.setState({
                            user: user
                        });
                    });

                    LoginStatus.dispatcher.unregister(LoginToken);
                    this.registerLogout.call(this);
                }
            }
        });
    }
    registerLogout(){
        var LoggoutToken = LoginStatus.register({}, (payload) => {
            if (payload.actionType === 'status-loggout') {
                this.setState({
                    user: null
                });
                LoginStatus.dispatcher.unregister(LoggoutToken);
            }
        });
    }

}

export default App;

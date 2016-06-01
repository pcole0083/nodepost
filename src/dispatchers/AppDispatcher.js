import {Dispatcher} from 'flux';

export const dispatcher = new Dispatcher();
//export const dispatch = dispatcher.dispatch;
import * as API from '../api';

export function registerLogin(){
    var scope = this;
    var LoginToken = dispatcher.register(payload => {
        if (payload.actionType === 'status-login') {
            let userData = API.ref.getAuth();
            if(!!userData) {
                API.auth.getUser(userData.uid, (snapshot) => {
                    let user = snapshot.exportVal();

                    scope.setState({
                        user: user
                    });
                });

                dispatcher.unregister(LoginToken);
                registerLogout.call(scope);
            }
        }
    });
}

export function registerLogout(){
    var scope = this;
    var LoggoutToken = dispatcher.register(payload => {
        if (payload.actionType === 'status-logout') {
            scope.setState({
                user: {}
            });
            dispatcher.unregister(LoggoutToken);
            registerLogin.call(scope);
        }
    });
}

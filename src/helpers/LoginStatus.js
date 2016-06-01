import * as API from '../api';
import * as AppDispatcher from '../dispatchers/AppDispatcher';

export default function LoginStatus(){
	var userState = {};

	var userCheck = () => {
        let userData = getAuth();
        if(userData){
            return getUser(userData);
        }
        return userData;
    };

	var getAuth = () => {
        return API.ref.getAuth();
    };

    var getUser = (userData) => {
        return API.auth.getUser(userData.uid, updateUser);
    };

    var updateUser = (snapshot) => {
        let user = snapshot.exportVal();

        var statusChanged = user.username !== userState.username;

        userState = user;

        if(statusChanged && user && user.username){
            AppDispatcher.dispatcher.dispatch({
                actionType: 'status-login',
                isLoggedIn: true
            });
        }
    };

	return {
		userCheck: userCheck,
		getAuth: getAuth,
	    getUser: getUser,
	    updateUser: updateUser
    };
}();

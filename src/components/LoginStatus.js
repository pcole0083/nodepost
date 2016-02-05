import {Dispatcher} from 'flux';

export const dispatcher = new Dispatcher();
export const dispatch = dispatcher.dispatch;

export var status = {
	isLoggedIn: false
};

export function register (store, callback) {
	if(!callback){
		callback = function(payload) {
			if (payload.actionType === 'status-update') {
	    		store.isLoggedIn = payload.isLoggedIn;
	    		status.isLoggedIn = payload.isLoggedIn;
			}
		};
	}
	return dispatcher.register(callback);
}

// export function dispatch (statusUpdate) {
// 	return dispatcher
// }
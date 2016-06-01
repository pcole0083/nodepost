import Firebase from 'firebase';

export const baseUrl = 'https://post-pcoleman.firebaseio.com/';
export const posts = new Firebase(baseUrl+'posts');
export const postTypes = new Firebase(baseUrl+'postTypes');
export const users = new Firebase(baseUrl+'users');
export const groups = new Firebase(baseUrl+'groups');
export const categories = new Firebase(baseUrl+'categories');
export const tags = new Firebase(baseUrl+'tags');

export const ref = new Firebase(baseUrl);
export const _get = function(type) {
	if(!!type){
		return new Firebase(baseUrl+type);
	}
	return null;
}
export const auth = {

	//return {
		//ref: ref,
		//status: ref.getAuth,
		//logout: ref.unAuth,
		getUser: function(uid, callback){
			users.child(uid).once("value", callback);
		},
		setUser: function(uid){
			getUser(uid, function(snapshot){
				var user = snapshot.exportVal();
				if(!user) {
		            users.child(uid).set({
		              provider: authData.provider,
		              groups: ['users'],
		              username: getName(authData)
		            });
		        }
			})
		},
		getName: function(authData) {
		    var provider = authData[authData.provider];
		    var displayName = provider.displayName;
		    if (!!displayName){
		    	return displayName;
		    }
		    else {
		    	return provider.email.replace(/@.*/, '');
		    }
		}
	//}
}
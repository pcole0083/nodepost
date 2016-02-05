import Firebase from 'firebase';

export const posts = new Firebase('https://post-pcoleman.firebaseio.com/posts');
export const postTypes = new Firebase('https://post-pcoleman.firebaseio.com/postTypes');
export const users = new Firebase('https://post-pcoleman.firebaseio.com/users');

export const ref = new Firebase('https://post-pcoleman.firebaseio.com');

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
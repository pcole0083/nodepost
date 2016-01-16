import * as API from '../api';
//import only the Link property (Destructoring)

export default function makeLinks(html, callback){
		if(!html || !callback){
			return;
		}
        const anchor = /\[\[(.*)\]\]/g;

        return API.posts.once('value', snapshot => {
            let posts = snapshot.exportVal();
            let keys = Object.keys(posts);

            callback(html.replace(anchor, (match, anchorText) => {
                for(let key of keys){
                	let post = posts[key];
                	let postType = post['type'];

                    if(post.title === anchorText.trim() ){
                        return `<a href="/${postType}/${key}">${anchorText}</a>`;
                    }
                }
            }));
        })
    //}
}
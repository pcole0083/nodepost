//library imports
import React from 'react';
import ListItemWrapper from './ListItemWrapper';

class Categories extends React.Component {
	render() {
		let data = this.props.data;

        let categories = <ul className="categories" >
                {Object.keys(data).map(function(id) {
                	let link = {
                		to:   'category',
                		text: data[id]
                	};
                    return <ListItemWrapper key={id} data={data[id]} className='category' />;
                })}
            </ul>;

        return categories;
	}
}

export default Categories;
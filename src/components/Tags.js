//library imports
import React from 'react';
import ListItemWrapper from './ListItemWrapper';

class Tags extends React.Component {
	render() {
		let data = this.props.data;

        let tags = <ul className="tags" >
                {Object.keys(data).map(function(id) {
                    return <ListItemWrapper key={id} data={data[id]} className='tag' />;
                })}
            </ul>;

        return tags;
	}
}

export default Tags;
import React from 'react';

import List from './list.jsx';
import View from './view.jsx';
import Edit from './edit.jsx';
import Add from './add.jsx';
import AddPlus from './addPlus.jsx';
import Search from './search.jsx';

class Container extends React.Component {
    render() {
        return (
            <div>
                <Search />
                <Edit />
                <View />
                <div style={{textAlign: 'right', paddingBottom: 20, position: 'absolute', top: 130, right: '2%'}}>
                    <Add style ={{marginRight: '10'}} /><AddPlus />
                </div>
                <List />
            </div>
        );
    }
};

export default Container;

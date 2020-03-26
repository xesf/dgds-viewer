import React from 'react';

import './viewerapp.css';

import ViewerApp from './ViewerApp';

const Viewer = () => (
    <>
        <div className="ui inverted stackable mini menu" style={{ margin: '0' }}>
            <div className="item">
                <img src="assets/jonny.png" />
            </div>
            <div>
                <ViewerApp />
            </div>
        </div>
    </>
);

export default Viewer;

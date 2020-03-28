import React, { useState, useEffect } from 'react';
import async from 'async';

import './viewerapp.css';

import ResourceList from './components/ResourceList';
import ResourceContent from './components/ResourceContent';

import { preloadFileAsync } from '../utils/preload';
import { loadResourceMap } from '../resources';

const GameResources = {
    castaway: 'RESOURCE.MAP',
    turbosci: 'RESOURCE.MAP',
    hoc: 'VOLUME.RMF',
    willy: 'VOLUME.RMF',
    dragon: 'VOLUME.VGA',
};

const ViewerApp = ({ game }) => {
    const [resindex, setResindex] = useState();

    useEffect(() => {
        async.auto({
            resindex: preloadFileAsync(`data/${game}/${GameResources[game]}`),
        }, (err, files) => {
            setResindex(loadResourceMap(files.resindex));
        });
        return () => {};
    }, [game]);

    return (
        <div key={game} style={{ width: 'auto', height: 'auto', backgroundColor: '#fff' }}>
            <div className="ui visible sidebar inverted vertical menu small viewer-bkg" style={{ margin: '0', top: '40px', height: 'auto', overflowY: 'scroll' }}>
                {resindex && <ResourceList game={game} res={resindex} />}
            </div>
            <div
                className="pusher"
                style={{
                    marginLeft: '180px',
                    height: window.innerHeight - 45,
                    width: window.innerWidth,
                    overflowY: 'scroll'
                }}
            >
                {resindex && <ResourceContent game={game} res={resindex} />}
            </div>
        </div>
    );
};

export default ViewerApp;

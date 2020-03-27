import React, { useState } from 'react';

import './viewerapp.css';

import ViewerApp from './ViewerApp';

const Viewer = () => {
    const [game, setGame] = useState('castaway');
    return (
        <>
            <div className="ui inverted stackable mini menu" style={{ margin: '0' }}>
                <div className="item">
                    <img src="assets/jonny.png" />
                </div>
                <a
                    className={`item${game === 'castaway' ? ' active' : ''}`}
                    href="/#"
                    onClick={() => setGame('castaway')}
                >
                    Johnny Castaway (1992)
                </a>
                <a
                    className={`item${game === 'turbosci' ? ' active' : ''}`}
                    href="/#"
                    onClick={() => setGame('turbosci')}
                >
                    {'Quarky & Quaysoo\'s Turbo Science (1992)'}
                </a>
                <a
                    className={`item${game === 'hoc' ? ' active' : ''}`}
                    href="/#"
                    onClick={() => setGame('hoc')}
                >
                    Heart of China (1991)
                </a>
                <a
                    className={`item${game === 'willy' ? ' active' : ''}`}
                    href="/#"
                    onClick={() => setGame('willy')}
                >
                    The Adventures of Willy Beamish (1991)
                </a>
                <a
                    className={`item${game === 'dragon' ? ' active' : ''}`}
                    href="/#"
                    onClick={() => setGame('dragon')}
                >
                    Rise of the Dragon (1990)
                </a>
            </div>
            <div>
                <ViewerApp game={game} />
            </div>
        </>
    );
};

export default Viewer;

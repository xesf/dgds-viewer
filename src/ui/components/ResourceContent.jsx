import React, { useState, useEffect } from 'react';

import { loadResourceEntry } from '../../resources';

import { RESOURCES } from '../../global';

import ResourceView from './ResourceView';

const ResourceContent = ({ res }) => {
    const [data, setData] = useState();
    const [entries, setEntries] = useState();
    const [game, setGame] = useState();
    const [resource, setResource] = useState();
    const [name, setName] = useState();

    const onHashChanged = () => {
        const hash = window.location.hash;
        if (hash) {
            setGame(hash.split('=')[1].split(',')[0]);
            setResource(hash.split('=')[1].split(',')[1]);
            setName(hash.split('=')[1].split(',')[2]);
        }
    };

    useEffect(() => {
        window.addEventListener('hashchange', onHashChanged);
        return () => {
            window.removeEventListener('hashchange', onHashChanged);
        };
    }, [res]);

    useEffect(() => {
        if (name) {
            const e = RESOURCES[`${game}-${resource}`].entries;
            setEntries(e);
            const entry = RESOURCES[`${game}-${resource}`].entries.find((f) => f.name === name);
            setData(loadResourceEntry(entry));
        }
        return () => {};
    }, [res, game, name, resource]);

    return (
        <div className="ui basic segment" style={{ overflowY: 'scroll' }}>
            <div className="ui basic segment">
                <b>{name}</b>
            </div>
            {data && <ResourceView entries={entries} data={data} />}
            {!name && 'No resource loaded. Please select one of the resources from the left menu.'}
        </div>
    );
};

export default ResourceContent;

import React, { useEffect, useState } from 'react';
import { map } from 'lodash';
import async from 'async';

import { preloadFileAsync } from '../../utils/preload';
import { loadResourcebyName } from '../../resources';

import { RESOURCES } from '../../global';

const ResourceItems = ({ game, res }) => {
    const [resource, setResource] = useState(null);

    useEffect(() => {
        async.auto({
            res: preloadFileAsync(`data/${game}/${res.name}`),
        }, (err, files) => {
            if (!RESOURCES[`${game}-${res.name}`]) {
                RESOURCES[`${game}-${res.name}`] = loadResourcebyName(res, files.res);
            }
            setResource(RESOURCES[`${game}-${res.name}`]);
        });
        return () => {};
    }, [name]);

    return resource && resource.entries && (
        map(resource.entries,
            (entry, i) => (
                <a
                    key={`${entry.name}${i}`}
                    className="item"
                    href={`#entry=${game},${res.name},${entry.name}`}
                >
                    {entry.name}
                </a>
            )
        )
    );
};

export default ResourceItems;

import React, { useState } from 'react';
import { map } from 'lodash';

import ResourceItems from './ResourceItems';

const ResourceList = ({ game, res }) => {
    const [name, setName] = useState(null); // res.resources[0].name

    return (
        <>
            {map(res.resources,
                (r) => (
                    <div
                        key={r.name}
                        className={`item${r.name === name ? ' active' : ''}`}
                    >
                        <div
                            className="header"
                            onClick={() => setName(r.name)}
                            style={{ cursor: 'pointer' }}
                        >
                            {r.name}
                        </div>
                        {r.name === name && (
                            <div
                                className="menu"
                            >
                                <ResourceItems
                                    key={`${r.name}-items`}
                                    game={game}
                                    res={res.resources.find((rr) => rr.name === name)}
                                />
                            </div>
                        )}
                    </div>
                )
            )}
        </>
    );
};

export default ResourceList;

import React from 'react';

import { map } from 'lodash';


const ResourceList = ({ res }) => (
    <>
        <div className="item">
            <div className="header">{res.resources[0].name}</div>
            <div className="menu">
                {map(res.resources[0].entries,
                    (entry) => {
                        if (entry.type === 'VIN') {
                            return null;
                        }
                        return (
                            <a key={entry.name} className="item" href={`#entry=${entry.name}`}>
                                {entry.name}
                            </a>
                        );
                    })}
            </div>
        </div>
    </>
);

export default ResourceList;

import React, { useState } from 'react';
import { map } from 'lodash';


const ResourceList = ({ res }) => {
    const [resName, setResName] = useState(res.resources[0].name);

    return (
        <>
            {map(res.resources,
                (r) => (
                    <div
                        className={`item${r.name === resName ? ' active' : ''}`}
                    >
                        <div
                            className="header"
                            onClick={() => setResName(r.name)}
                            style={{ cursor: 'pointer' }}
                        >
                            {r.name}
                        </div>

                        {/* <a
                            key={r.name}
                            className="header"
                            href="/#"
                        >
                            {r.name}
                        </a> */}
                        {/* <div className="menu">
                            {map(r.entries,
                                (entry) => {
                                    if (entry.type === 'VIN') {
                                        return null;
                                    }
                                    return (
                                        <a
                                            key={entry.name}
                                            className="item"
                                            href={`#entry=${entry.name}`}
                                        >
                                            {entry.name}
                                        </a>
                                    );
                                })}
                        </div> */}
                    </div>
                )
            )}
        </>
    );
};

export default ResourceList;

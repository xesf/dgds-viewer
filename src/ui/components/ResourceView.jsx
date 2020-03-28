import React, { useRef, useEffect, useState } from 'react';

import { drawAllImages, drawPalette, drawScreen } from '../../graphics';
import ScriptCode from './ScriptCode';

import { startProcess, stopProcess } from '../../scripting/process';

const nop = (data, context) => {
    context.canvas.width = 640;
    context.canvas.height = 480;

    context.fillStyle = 'black';
    context.fillRect(0, 0, 640, 480);
};

export const ResourceType = [
    { type: 'ADS', callback: nop }, // Animation sequences
    { type: 'BMP', callback: drawAllImages }, // Various raw images
    { type: 'PAL', callback: drawPalette }, // VGA palette
    { type: 'SCR', callback: drawScreen }, // Background raw images
    { type: 'TTM', callback: nop }, // Scripting macros
    { type: 'VIN', callback: nop }, // preload files
];

const ResourceView = ({ entries, data }) => {
    const canvasRef = useRef();
    const mainCanvasRef = useRef();
    const [script, setScript] = useState();

    const updateScriptLine = (s) => {
        setScript(s);
    };

    useEffect(
        () => {
            if (data !== undefined) {
                stopProcess();

                const context = canvasRef.current.getContext('2d');
                context.clearRect(0, 0, 640, 480);

                const resType = ResourceType.find((r) => r.type === data.type);
                if (resType !== undefined) {
                    resType.callback(data, context);

                    if (resType.type === 'ADS'
                        || resType.type === 'TTM') {
                        const mainContext = mainCanvasRef.current.getContext('2d');
                        context.clearRect(0, 0, 640, 480);
                        mainContext.clearRect(0, 0, 640, 480);
                        mainContext.canvas.width = 640;
                        mainContext.canvas.height = 480;

                        startProcess({
                            type: resType.type,
                            context,
                            mainContext,
                            data,
                            entries,
                            callback: updateScriptLine
                        });
                    }
                }
            }

            return () => {};
        },
        [data]
    );

    if (data.type !== 'ADS'
        && data.type !== 'TTM') {
        return (
            <>
                <div style={{ display: 'block', width: '100%', height: '500px', overflowX: 'auto'}}>
                    <canvas ref={canvasRef} width="640" height="480" />
                </div>
            </>
        );
    }

    return (
        <>
            <div style={{ display: 'block', width: '100%', height: '500px', overflowX: 'auto'}}>
                <canvas ref={mainCanvasRef} width="640" height="480" style={{ position: 'absolute', zIndex: '0' }} />
                <canvas ref={canvasRef} width="640" height="480" style={{ position: 'absolute', zIndex: '1' }} />
            </div>
            {data.scripts
                && (
                    <div style={{
                        height: '300px',
                        width: '640px',
                        overflowY: 'scroll'
                    }}
                    >
                        <ScriptCode scripts={data.scripts} current={script} />
                    </div>
                )
            }
        </>
    );
};

export default ResourceView;

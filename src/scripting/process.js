/* eslint-disable */
import { remove } from 'lodash';
import { loadResourceEntry } from '../resources';

import { drawImage, drawScreen, getPaletteColor } from '../graphics/index';
import { createAudioManager } from '../audio';
import { RESOURCES } from '../global';

let tick = null;
let prevTick = Date.now();
let elapsed = null;
const fps = 1000 / 60;

let state = null;
let currentScene = 0;

let scenesRes = [];
let scenes = [];
let scenesRandom = [];
let addScenes = [];
let removeScenes = [];

let bkgScreen = null;
let bkgRes = null;
let bkgOcean = [];
let bkgRaft = null;
let cloudIdx = Math.floor((Math.random() * 3) + 15);
let cloudX = Math.floor((Math.random() * 640));
let cloudY = Math.floor((Math.random() * 80));
let cloudElapsed = 0;

const clearContext = (context) => {
    context.clearRect(0, 0, 640, 480);
};

const drawContext = (state, index) => {
    const save = state.save[state.saveIndex];
    if (save.canDraw) {
        save.canDraw = false;
        state.context.drawImage(save.context.canvas, 0, 0);
    }
}

// FIXME Improve this code repetition
const drawBackground = (state, context) => {
    // Draw background / ocean / night
    if (bkgScreen) {
        drawScreen(bkgScreen, context);
    }

    if (state.island) {
        const posX = (state.island === 1) ? 288 : 16;

        if (!cloudElapsed) {
            cloudElapsed = Math.floor((Math.random() * 640)) + Date.now();
        }
        if (Date.now() > cloudElapsed) {
            cloudElapsed = 0;
            cloudX--;
        }

        // Draw island
        if (bkgRes) {
            // Draw clouds (random and animated)
            let image = bkgRes.images[cloudIdx];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, cloudX, cloudY, image.width, image.height);

            // Draw raft based on state
            image = bkgRaft.images[3];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 222, 268, image.width, image.height);

            // isle
            image = bkgRes.images[0];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX, 280, image.width, image.height);

            // palm tree
            image = bkgRes.images[14];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 108, 280, image.width, image.height);
            image = bkgRes.images[13];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 154, 148, image.width, image.height);
            image = bkgRes.images[12];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 77, 122, image.width, image.height);
            
            // Draw shore with animations
            image = bkgRes.images[3];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX - 13, 305, image.width, image.height);

            image = bkgRes.images[6];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 76, 320, image.width, image.height);

            image = bkgRes.images[10];
            drawImage(image, state.tmpContext, 0, 0);
            context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, posX + 230, 303, image.width, image.height);

            // Draw low tide
        }
    }
}

// TTM COMMANDS
const SAVE_BACKGROUND = (state) => { };

const DRAW_BACKGROUND = (state) => {
    // RESTORE_REGION(state, 0, 0, 0, 0);
    drawBackground(state, state.mainContext);
};

const PURGE = (state) => {
    // state.purge = true;
};

const UPDATE = (state) => { 
    if (state.continue) {
        if (!state.delay) {
            return;
        }
        state.continue = false;
        state.elapsed = state.delay + Date.now();
    }
    if (Date.now() > state.elapsed) {
        state.elapsed = 0;
        state.continue = true;
        // TODO not reaching here for some reason
        console.log('elapsed', state.elapsed, state.continue);
        if (state.lastCommand) {
            console.log('last command', state.lastCommand);
            state.lastCommand = false;
            state.played = true; // time is over since last update
        }
    }
};

const SET_DELAY = (state, delay) => {
    state.delay = ((delay === 0 ? 1 : delay) * 20);
};

const SLOT_IMAGE = (state, slot) => {
    state.slot = slot;
};

const SLOT_PALETTE = (state) => { };
const TTM_UNKNOWN_0 = (state) => { };

const SET_SCENE = (state) => {};

const SET_BACKGROUND = (state, index) => {
    state.saveIndex = index;
};

const GOTO = (state, tagId) => {
    state.reentry = 0; // TODO check for other scenes
};

const SET_COLORS = (state, fc, bc) => {
    if (fc < 16) {
        state.foregroundColor = RESOURCES.PALETTE[fc];
    }
    if (bc < 16) {
        state.backgroundColor = RESOURCES.PALETTE[bc];
    }
};

const SET_FRAME1 = (state) => { };

const SET_TIMER = (state, delay, timer) => {
    state.delay = ((delay === 0 ? 1 : delay) * 20);
    state.timer = timer * 20;
};

const SET_CLIP_REGION = (state, x1, y1, x2, y2) => {
    state.clip = {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
    };
    // console.log('SET_CLIP_REGION', state.clip);
    // state.context.strokeStyle = getPaletteColor(PALETTE[12]);
    // state.context.lineWidth = '3';
    // state.context.rect(state.clip.x, state.clip.y, state.clip.width, state.clip.height);
    // state.context.stroke();
};

const FADE_OUT = (state) => { };
const FADE_IN = (state) => { };

const DRAW_BACKGROUND_REGION = (state, x, y, width, height) => {
    const save = state.saveBkg[0];
    save.canDraw = true;
    save.x = x;
    save.y = y;
    save.width = width;
    save.height = height;

    save.context.drawImage(
        state.context.canvas,
        x, y, width, height,
        x, y, width, height,
    );
};

const SAVE_IMAGE_REGION = (state, x, y, width, height) => {
    // const save = state.save[state.saveIndex];
    // save.canDraw = true;
    // save.x = x;
    // save.y = y;
    // save.width = width;
    // save.height = height;
    
    // save.context.drawImage(
    //     state.context.canvas,
    //     x, y, width, height,
    //     x, y, width, height,
    // );
};

const TTM_UNKNOWN_4 = (state, x, y, width, height) => {
    // console.log('TTM_UNKNOWN_4', state.clip);
    // state.context.strokeStyle = getPaletteColor(PALETTE[12]);
    // state.context.lineWidth = '3';
    // state.context.rect(x, y, width, height);
    // state.context.stroke();
};

const SAVE_REGION = (state, x, y, width, height) => {
    // state.clip = {
    //     x,
    //     y,
    //     width,
    //     height,
    // };
};

const RESTORE_REGION = (state, x, y, width, height) => {
    const save = state.saveBkg[0];
    save.canDraw = false;
    save.x = 0;
    save.y = 0;
    save.width = 0;
    save.height = 0;
    clearContext(save.context);
};

const DRAW_LINE = (state, x1, y1, x2, y2) => {
    state.context.beginPath();
    state.context.moveTo(x1, y1);
    state.context.lineTo(x2, y2);
    state.context.closePath();
    state.context.strokeStyle = 'white';
    state.context.stroke();
};

const DRAW_RECT = (state, x, y, width, height) => {
    state.context.fillStyle = getPaletteColor(state.foregroundColor);
    state.context.fillRect(x, y, width, height);
};

const DRAW_BUBBLE = (state, x, y, width, height) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2;
    state.context.beginPath();
    state.context.arc(x + centerX, y + centerY, radius, 0, 2 * Math.PI, false);
    state.context.closePath();
    state.context.fillStyle = 'white';
    state.context.fill();
    state.context.strokeStyle = 'white';
    state.context.stroke();
};

const DRAW_SPRITE = (state, offsetX, offsetY, index, slot) => { 
    if (state.res[slot] === undefined) {
        return;
    }
    const image = state.res[slot].images[index];
    if (image !== undefined) {
        state.context.save();
        state.context.beginPath();
        state.context.rect(state.clip.x, state.clip.y, state.clip.width, state.clip.height);
        state.context.clip();

        drawImage(image, state.tmpContext, 0, 0);
        state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, offsetX, offsetY, image.width, image.height);
        state.context.restore();
    }
};

const DRAW_SPRITE_FLIP = (state, offsetX, offsetY, index, slot) => {
    if (state.res[slot] === undefined) {
        return;
    }
    const image = state.res[slot].images[index];
    if (image !== undefined) {
        state.context.save();
        state.context.beginPath();
        state.context.rect(state.clip.x, state.clip.y, state.clip.width, state.clip.height);
        state.context.clip();

        drawImage(image, state.tmpContext, 0, 0);
        state.context.save();
        state.context.translate(image.width, 0);
        state.context.scale(-1, 1);
        state.context.drawImage(state.tmpContext.canvas, 0, 0, image.width, image.height, -offsetX, offsetY, image.width, image.height);
        state.context.restore();
        state.context.restore();
    }
};

const DRAW_SPRITE1 = (state) => { };
const DRAW_SPRITE3 = (state) => { };

const clearScreen = (state, index) => {
    clearContext(state.context);
    clearContext(state.tmpContext);
    drawContext(state);
};

const CLEAR_SCREEN = (state, index) => {
    clearScreen(state, index);
};

const DRAW_SCREEN = (state) => { };

const LOAD_SAMPLE = (state) => { };
const SELECT_SAMPLE = (state) => { };
const DESELECT_SAMPLE = (state) => { };

const PLAY_SAMPLE = (state, index) => {
    const sampleSource = state.audioManager.getSoundFxSource();
    sampleSource.load(index, () => {
        sampleSource.play();
    });
};

const STOP_SAMPLE = (state) => { };

const SCREEN_TYPE = {
    'ISLETEMP.SCR': 1,
    'ISLAND2.SCR': 2,
    'SUZBEACH.SCR': 0,
    'JOFFICE.SCR': 0,
    'THEEND.SCR': 0,
    'INTRO.SCR': 0,
}

const loadBackground = (state) => {
    // Load background assets if not loaded yet
    if (!bkgRes) {
        const entry = state.entries.find(e => e.name === 'BACKGRND.BMP');
        if (entry !== undefined) {
            bkgRes = loadResourceEntry(entry);
        }
    }
}

const loadRaft = (state) => {
    if (!bkgRaft) {
        const entry = state.entries.find(e => e.name === 'MRAFT.BMP');
        if (entry !== undefined) {
            bkgRaft = loadResourceEntry(entry);
        }
    }
}

const loadOcean = (state) => {
    if (bkgOcean.length === 0) {
        // FIXME shorten this code later
        let entry = state.entries.find(e => e.name === 'OCEAN00.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        entry = state.entries.find(e => e.name === 'OCEAN01.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        entry = state.entries.find(e => e.name === 'OCEAN02.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        entry = state.entries.find(e => e.name === 'NIGHT.SCR');
        if (entry !== undefined) {
            bkgOcean.push(loadResourceEntry(entry));
        }
        const isNight = false; // calculate night shift here
        let oceanIdx = Math.floor((Math.random() * 4)); // 0 to 3 (adding night for now)
        if (isNight) {
            oceanIdx = 4;
        }
        bkgScreen = bkgOcean[oceanIdx];
    }
}

const LOAD_SCREEN = (state, name) => {
    state.island = SCREEN_TYPE[name];
    
    if (!bkgScreen) {
        const entry = state.entries.find(e => e.name === name);
        if (entry !== undefined) {
            bkgScreen = loadResourceEntry(entry);
        }
    }

    if (state.island) {
        loadBackground(state);
        loadRaft(state);
        loadOcean(state);
    }
};

const LOAD_IMAGE = (state, name) => {
    if (name === 'FLAME.BMP' || name === 'FLURRY.BMP') {
        name = 'FIRE1.BMP';
    }
    const entry = state.entries.find(e => e.name === name);
    if (entry !== undefined) {
        state.res[state.slot] = loadResourceEntry(entry);
    }
};

const LOAD_PALETTE = (state) => { };

// ADS COMMANDS
const ADS_UNKNOWN_0 = (state) => { };

const IF_NOT_PLAYED = (state, sceneIdx, tagId) => {
    // if (state.continue) {
    //     state.continue = false;
    // }
    // if (state.played.length > 0) {
    //     const scene = state.played.find(s => s.sceneIdx === sceneIdx && s.tagId === tagId);
    //     if (scene !== undefined) {
    //         state.continue = true;
    //         // TODO OR Skip
    //     }
    // } else {
    //     state.continue = true;
    // }
};

const IF_PLAYED = (state, sceneIdx, tagId) => {
    if (state.continue) {
        state.continue = false;
    }
    const scene = scenes.find(s => 
        s.sceneIdx === sceneIdx && s.tagId === tagId
        && s.state.played);
    if (scene !== undefined) {
        // STOP_SCENE(state, sceneIdx, tagId, 0);
        // console.log(scenes);
        // scenes = scenes.filter(s => s.sceneIdx !== sceneIdx && s.tagId !== tagId);
        // console.log(scenes);
        // console.log(sceneIdx, tagId);
        // console.log(scene.sceneIdx, scene.tagId);
        // if (!scene.state.elapsedTimer && scene.state.timer > 0) {
        //     console.log(scene.state.elapsedTimer);
        //     scene.state.elapsedTimer = scene.state.timer + Date.now();
        //     console.log(scene.state.elapsedTimer);
        // }
        if (scene.state.timer === 0) { // /* || Date.now() > scene.state.elapsedTimer*/
            removeScenes.push({
                sceneIdx,
                tagId,
            });
        }
        // if (!scene.state.timer) {
        //     STOP_SCENE(state, sceneIdx, tagId, 0);
        // }
        state.continue = true;
    }
};

const IF_NOT_RUNNING = (state) => { };
const IF_RUNNING = (state) => { };
const AND = (state) => { };
const OR = (state) => { };

const PLAY_SCENE = (state) => {
    if (state.continue) {
        state.continue = false;

        console.log('before remove', scenes.slice(0));
        if (removeScenes.length > 0) {
            // sss = scenes.filter(s => {
            //     for (let e = 0; e < removeScenes.length; e += 1) {
            //         const ss = removeScenes[e];
            //         if (ss.sceneIdx === s.sceneIdx && ss.tagId === s.tagId) {
            //             return true;
            //         }
            //     }
            //     return false;
            // });
            // console.log('remove results', sss);
            // scenes = [ ...ss ];
            removeScenes.forEach(s => {
                console.log(s);
                remove(scenes, ss => ss.sceneIdx === s.sceneIdx && ss.tagId === s.tagId);
                // scenes = scenes.filter(ss => ss.sceneIdx !== s.sceneIdx && ss.tagId !== s.tagId);
                // const index = scenes.indexOf(s => s.sceneIdx === sceneIdx && s.tagId === tagId);
                // scenes.splice(index, 1);
            });
            removeScenes = [];
        }
        console.log('after remove, before add', scenes.slice(0));
        if (addScenes.length > 0) {
            addScenes.forEach(s => {
                scenes.push(getSceneState(
                    state,
                    s.sceneIdx,
                    s.tagId, 
                    s.retriesDelay,
                    s.unk,
                ));
            });
            addScenes = [];
        }
        // scenes = sss;
        console.log('final', scenes.slice(0));
    }

    let canContinue = false;
    scenes.forEach(s => {
        canContinue = canContinue | (s.state.runs > 0) ? true : false;
        // if (s.state.elapsedTimer && Date.now() > s.state.elapsedTimer) {
        //     removeScenes.push({
        //         sceneIdx: s.sceneIdx,
        //         tagId: s.tagId,
        //     });
        // }
    });

    // if (removeScenes.length > 0) {
    //     removeScenes.forEach(s => {
    //         STOP_SCENE(state, s.sceneIdx, s.tagId, 0);
    //     });
    //     removeScenes = [];
    // }
    if (scenes.length === 0) {
        canContinue = true;
    }
    
    state.continue = canContinue;
}; // runScripts has the continue logic 

const PLAY_SCENE_2 = (state) => { };

const initialState = {
    reentry: 0,
    lastCommand: false,
    runs: 0,
    played: false,
    continue: true,
    skip: false,
    island: 1,
    elapsedTimer: 0,
    timer: 0,
    delay: 0,
};

const ADD_SCENE = (state, sceneIdx, tagId, retriesDelay, unk) => {
    if (state.randomize) {
        scenesRandom.push({
            sceneIdx,
            tagId, 
            retriesDelay,
            unk,
        });
        return;    
    }

    addScenes.push({
        sceneIdx,
        tagId, 
        retriesDelay,
        unk,
    });
}

const getSceneState = (state, sceneIdx, tagId, retriesDelay, unk) => {
    const ttm = scenesRes[sceneIdx - 1];
    if (ttm === undefined || ttm.scenes === undefined) {
        console.log('add failed ttm', sceneIdx, tagId);
        return;
    }
    const scene = ttm.scenes.find(s => s.tagId === tagId);
    const retries = retriesDelay >= 0 ? retriesDelay : 0;
    const delay = retriesDelay < 0 ? retriesDelay : state.delay;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;

    const stateInit = { ...initialState, context: canvas.getContext('2d') };

    const s = Object.assign({ sceneIdx, delay, retries }, scene);
    if (s.script === undefined) {
        console.log('add failed script', sceneIdx, tagId, scene, ttm);
        return;
    }
    if (!scenes.length) {
        s.script.unshift(...ttm.scenes[0].script);
        s.state = Object.assign({}, state, stateInit);
    } else {
        s.state = Object.assign({}, scenes[0].state, stateInit);
    }
    return s;
};

const STOP_SCENE = (state, sceneIdx, tagId, retries) => {
    removeScenes.push({
        sceneIdx,
        tagId,
        retries,
    });
    // console.log('STOP_SCENE', removeScenes);
    // console.log(scenes);
    // remove(scenes, s => s.sceneIdx === sceneIdx && s.tagId === tagId);
    // const index = scenes.indexOf(s => s.sceneIdx === sceneIdx && s.tagId === tagId);
    // scenes.splice(index, 1);
    // delete scenes[index];
    // scenes = scenes.filter(s => s.sceneIdx !== sceneIdx && s.tagId !== tagId);
    // console.log(scenes);
    // const index = scenes.indexOf(s => s.sceneIdx === sceneIdx && s.tagId === tagId);
    // scenes.splice(index, 1);

    // const s = scenes.filter(s => s.sceneIdx !== sceneIdx && s.tagId !== tagId);
    // if (s !== undefined) {
    //     scenes = s;
    // }
    /* else {
        scenes = [];
    }*/
};

const RANDOM_START = (state) => {
    state.randomize = true;
    scenesRandom = [];
};

const RANDOM_UNKNOWN_0 = (state) => { };

const RANDOM_END = (state) => {
    state.randomize = false;
    const index = Math.floor((Math.random() * scenesRandom.length));
    const scene = scenesRandom[index];
    if (scene !== undefined) {
        ADD_SCENE(state, scene.sceneIdx, scene.tagId, scene.retriesDelay, scene.unk);
    }
};

const ADS_UNKNOWN_6 = (state) => { };
const ADS_FADE_OUT = (state) => { };
const RUN_SCRIPT = (state) => { };

const END = (state) => {
    if (!state.continue) {
        state.continue = true;
    } else if (state.continue) {
        state.continue = false;
    }
    const scene = scenes.find(s => s.state.played);
    if (state.lastCommand && scene !== undefined) {
        scenes = [];
        state.continue = true;
    }
};

// CUSTOM COMMAND
const END_IF = (state) => { };

// const CommandType = [
//     // TTM COMMANDS
//     { opcode: 0x0020, callback: SAVE_BACKGROUND },
//     { opcode: 0x0080, callback: DRAW_BACKGROUND },
//     { opcode: 0x0110, callback: PURGE },
//     { opcode: 0x0FF0, callback: UPDATE },
//     { opcode: 0x1020, callback: SET_DELAY },
//     { opcode: 0x1050, callback: SLOT_IMAGE },
//     { opcode: 0x1060, callback: SLOT_PALETTE },
//     { opcode: 0x1100, callback: TTM_UNKNOWN_0 },
//     { opcode: 0x1110, callback: SET_SCENE },
//     { opcode: 0x1120, callback: SET_BACKGROUND },
//     { opcode: 0x1200, callback: GOTO }, 
//     { opcode: 0x2000, callback: SET_COLORS },
//     { opcode: 0x2010, callback: SET_FRAME1 },
//     { opcode: 0x2020, callback: SET_TIMER },
//     { opcode: 0x4000, callback: SET_CLIP_REGION },
//     { opcode: 0x4110, callback: FADE_OUT },
//     { opcode: 0x4120, callback: FADE_IN },
//     { opcode: 0x4200, callback: DRAW_BACKGROUND_REGION },
//     { opcode: 0x4210, callback: SAVE_IMAGE_REGION },
//     { opcode: 0xA000, callback: TTM_UNKNOWN_4 },
//     { opcode: 0xA050, callback: SAVE_REGION },
//     { opcode: 0xA060, callback: RESTORE_REGION },
//     { opcode: 0xA0A0, callback: DRAW_LINE },
//     { opcode: 0xA100, callback: DRAW_RECT },
//     { opcode: 0xA400, callback: DRAW_BUBBLE },
//     { opcode: 0xA500, callback: DRAW_SPRITE },
//     { opcode: 0xA510, callback: DRAW_SPRITE1 },
//     { opcode: 0xA520, callback: DRAW_SPRITE_FLIP },
//     { opcode: 0xA530, callback: DRAW_SPRITE3 },
//     { opcode: 0xA600, callback: CLEAR_SCREEN },
//     { opcode: 0xB600, callback: DRAW_SCREEN },
//     { opcode: 0xC020, callback: LOAD_SAMPLE },
//     { opcode: 0xC030, callback: SELECT_SAMPLE },
//     { opcode: 0xC040, callback: DESELECT_SAMPLE },
//     { opcode: 0xC050, callback: PLAY_SAMPLE },
//     { opcode: 0xC060, callback: STOP_SAMPLE },
//     { opcode: 0xF010, callback: LOAD_SCREEN },
//     { opcode: 0xF020, callback: LOAD_IMAGE },
//     { opcode: 0xF050, callback: LOAD_PALETTE },
//     // ADS COMMANDS
//     { opcode: 0x1070, callback: ADS_UNKNOWN_0 },
//     { opcode: 0x1330, callback: IF_NOT_PLAYED },
//     { opcode: 0x1350, callback: IF_PLAYED },
//     { opcode: 0x1360, callback: IF_NOT_RUNNING },
//     { opcode: 0x1370, callback: IF_RUNNING },
//     { opcode: 0x1420, callback: AND },
//     { opcode: 0x1430, callback: OR },
//     { opcode: 0x1510, callback: PLAY_SCENE },
//     { opcode: 0x1520, callback: PLAY_SCENE_2 },
//     { opcode: 0x2005, callback: ADD_SCENE },
//     { opcode: 0x2010, callback: STOP_SCENE },
//     { opcode: 0x3010, callback: RANDOM_START },
//     { opcode: 0x3020, callback: RANDOM_UNKNOWN_0 },
//     { opcode: 0x30ff, callback: RANDOM_END },
//     { opcode: 0x4000, callback: ADS_UNKNOWN_6 },
//     { opcode: 0xf010, callback: ADS_FADE_OUT },
//     { opcode: 0xf200, callback: RUN_SCRIPT }, 
//     { opcode: 0xffff, callback: END },
//     // CUSTOM: Added for text script
//     { opcode: 0xfff0, callback: END_IF },
// ];

const CommandType2 = {
    // TTM COMMANDS
    '0x0020': SAVE_BACKGROUND,
    '0x0080': DRAW_BACKGROUND,
    '0x0110': PURGE,
    '0x0FF0': UPDATE,
    '0x1020': SET_DELAY,
    '0x1050': SLOT_IMAGE,
    '0x1060': SLOT_PALETTE,
    '0x1100': TTM_UNKNOWN_0,
    '0x1110': SET_SCENE,
    '0x1120': SET_BACKGROUND,
    '0x1200': GOTO, 
    '0x2000': SET_COLORS,
    '0x2010': SET_FRAME1,
    '0x2020': SET_TIMER,
    '0x4000': SET_CLIP_REGION,
    '0x4110': FADE_OUT,
    '0x4120': FADE_IN,
    '0x4200': DRAW_BACKGROUND_REGION,
    '0x4210': SAVE_IMAGE_REGION,
    '0xA000': TTM_UNKNOWN_4,
    '0xA050': SAVE_REGION,
    '0xA060': RESTORE_REGION,
    '0xA0A0': DRAW_LINE,
    '0xA100': DRAW_RECT,
    '0xA400': DRAW_BUBBLE,
    '0xA500': DRAW_SPRITE,
    '0xA510': DRAW_SPRITE1,
    '0xA520': DRAW_SPRITE_FLIP,
    '0xA530': DRAW_SPRITE3,
    '0xA600': CLEAR_SCREEN,
    '0xB600': DRAW_SCREEN,
    '0xC020': LOAD_SAMPLE,
    '0xC030': SELECT_SAMPLE,
    '0xC040': DESELECT_SAMPLE,
    '0xC050': PLAY_SAMPLE,
    '0xC060': STOP_SAMPLE,
    '0xF010': LOAD_SCREEN,
    '0xF020': LOAD_IMAGE,
    '0xF050': LOAD_PALETTE,
    // ADS COMMANDS
    '0x1070': ADS_UNKNOWN_0,
    '0x1330': IF_NOT_PLAYED,
    '0x1350': IF_PLAYED,
    '0x1360': IF_NOT_RUNNING,
    '0x1370': IF_RUNNING,
    '0x1420': AND,
    '0x1430': OR,
    '0x1510': PLAY_SCENE,
    '0x1520': PLAY_SCENE_2,
    '0x2005': ADD_SCENE,
    '0x2010': STOP_SCENE,
    '0x3010': RANDOM_START,
    '0x3020': RANDOM_UNKNOWN_0,
    '0x30FF': RANDOM_END,
    '0x4000': ADS_UNKNOWN_6,
    '0xF010': ADS_FADE_OUT,
    '0xF200': RUN_SCRIPT, 
    '0xFFFF': END,
    // CUSTOM: Added for text script
    '0xFFF0': END_IF,
};

const runScript = (state, script, main = false) => {
    if (script === undefined || state.reentry === -1) {
        return true;
    }
    for (let i = state.reentry; i < script.length; i++) {
        const c = script[i];
        //const type = CommandType.find(ct => ct.opcode === c.opcode);
        const callback = CommandType2[`0x${c.opcode.toString(16).padStart(4, '0').toUpperCase()}`];
        if (!callback || callback === undefined) {
            continue;
        }
        if (main) {
            console.log(c.line);
        }
        if (i === (script.length - 1)) {
            state.lastCommand = true;
        }
        callback(state, ...c.params);
        state.reentry = i;
        if (!state.continue) {
            break;
        }
    }
    if (state.reentry === (script.length - 1)) {
        state.lastCommand = true;
        state.reentry = 0;
        state.runs++;
        if (!state.continue) {
            state.continue = true;
        }
        state.played = true;
        if (main) {
            currentScene++;
        }
        if (state.type === 'TTM') {
            return true;
        }
    }
    return false;
};

const runScripts = () => {
    if (state.type === 'ADS') {
        let exitFrame = false;

        clearContext(state.context);

        if (state.island) {
            drawBackground(state, state.mainContext);
        }
        const saveBkg = state.saveBkg[0];
        if (saveBkg.canDraw) {
            state.context.drawImage(saveBkg.context.canvas, 0, 0);
        }
    
        const scene = state.data.scenes[currentScene];
        if (scene !== undefined) {
            exitFrame = runScript(state, scene.script, true);
        }
        
        if (!state.continue) {
            scenes.forEach(s => {
                runScript(s.state, s.script);
            // });
            // scenes.forEach(s => {
                state.context.drawImage(s.state.context.canvas, 0, 0);
            });
        }
        return exitFrame;
    } else {
        if (state.island) {
            drawBackground(state, state.mainContext);
        }
        return runScript(state, state.data.scripts);
    }
};

export const startProcess = (initialState) => {
    // FIXME this state needs a deep clean up
    state = {
        data: null,
        context: null,
        tmpContext: null,
        mainContext: null,
        save: [],
        saveIndex: 0,
        saveBkg: [],
        audioManager: null,
        slot: 0,
        res: [],
        // this should be for multiple running scripts
        reentry: 0,
        elapsed: 0,
        elapsedTimer: 0,
        delay: 0,
        timer: 0,
        continue: true,
        frameId: null,
        island: 1,
        foregroundColor: RESOURCES.PALETTE[0],
        backgroundColor: RESOURCES.PALETTE[0],
        clip: { x: 0, y: 0, width: 640, height: 480 },
        type: null,
        skip: false,
        randomize: false,
        purge: false,
        played: false,
        runs: 0,
        lastCommand: false,
        ...initialState,
    };
    bkgScreen = null;
    bkgRes = null;
    bkgOcean = [];
    bkgRaft = null;
    currentScene = 0;

    // temp canvas
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = 640;
    tmpCanvas.height = 480;  
    state.tmpContext = tmpCanvas.getContext('2d');

    for (let s = 0; s < 3; s += 1) {
        const c = document.createElement("canvas");
        c.width = 640;
        c.height = 480;
        state.save.push({
            context: c.getContext('2d'),
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            canDraw: false,
        });
    }

    const c = document.createElement("canvas");
    c.width = 640;
    c.height = 480;
    state.saveBkg.push({
        context: c.getContext('2d'),
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        canDraw: false,
    });

    state.audioManager = createAudioManager({ soundFxVolume: 0.50 });

    if (state.type === 'ADS') {
        state.data.resources.forEach(r => {
            const entry = state.entries.find(e => e.name === r.name);
            if (entry !== undefined) {
                scenesRes.push(loadResourceEntry(entry));
            }
        });
    }
    console.log(state.data.scenes);
    mainloop();

    return state;
};

export const stopProcess = () => {
    if (state && state.frameId) {
        cancelAnimationFrame(state.frameId);
    }

    tick = null;
    prevTick = Date.now();
    elapsed = null;

    state = null;
    currentScene = 0;

    scenesRes = [];
    scenes = [];

    bkgScreen = null;
    bkgRes = null;
    bkgOcean = [];
    bkgRaft = null;
    cloudIdx = Math.floor((Math.random() * 3) + 15);
    cloudX = Math.floor((Math.random() * 640));
    cloudY = Math.floor((Math.random() * 80));
    cloudElapsed = 0;
};

window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || ((f) => setTimeout(f, 1000/60));

const mainloop = () => {
    state.frameId = requestAnimationFrame(mainloop);

    tick = Date.now();
    elapsed = tick - prevTick;

    if (elapsed > fps) {
        prevTick = tick - (elapsed % fps);
    }

    if (runScripts()) {
        cancelAnimationFrame(state.frameId);
    }
}
/* eslint-enable */

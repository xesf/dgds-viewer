import { INDEX_STRING_SIZE } from '../constants';
import { getString } from '../utils/string';

import { loadADSResourceEntry } from './ads';
import { loadBMPResourceEntry } from './bmp';
import { loadPALResourceEntry } from './pal';
import { loadSCRResourceEntry } from './scr';
import { loadTTMResourceEntry } from './ttm';

const NOP = () => {};

export const ResourceType = [
    { type: 'ADS', callback: loadADSResourceEntry }, // Animation sequences
    { type: 'BMP', callback: loadBMPResourceEntry }, // Various raw images
    { type: 'PAL', callback: loadPALResourceEntry }, // VGA palette
    { type: 'SCR', callback: loadSCRResourceEntry }, // Background raw images
    { type: 'TTM', callback: loadTTMResourceEntry }, // Scripting macros
    { type: 'VIN', callback: NOP }, //
    { type: 'SDS', callback: NOP }, //
    { type: 'FNT', callback: NOP }, //
    { type: 'DAT', callback: NOP }, //
    { type: 'DDS', callback: NOP }, //
    { type: 'TDS', callback: NOP }, //
    { type: 'REQ', callback: NOP }, //
    { type: 'WLD', callback: NOP }, //
    { type: 'SNG', callback: NOP }, //
    { type: 'ADL', callback: NOP }, //
    { type: 'ADH', callback: NOP }, //
    { type: 'RST', callback: NOP }, //
    { type: 'OVL', callback: NOP }, //
    { type: 'GDS', callback: NOP }, //
    { type: 'RST', callback: NOP }, //
    { type: 'SX', callback: NOP }, //
    { type: 'RES', callback: NOP }, //
];

const INDEX_HEADER_SIZE = 6;

/**
 * Load all Resource details based on index resource file
 * @param {*} filepath Full path of the file
 * @param {*} filename File name
 */
export const loadResourceMap = (buffer) => {
    let offset = 0; // current resource offest
    const resources = []; // list of resource files
    const data = new DataView(buffer, offset, buffer.byteLength);

    const header = {
        unk0: data.getUint8(offset, true),
        unk1: data.getUint8(offset + 1, true),
        unk2: data.getUint8(offset + 2, true),
        unk3: data.getUint8(offset + 3, true),
        numResources: data.getUint8(offset + 4, true),
        unk5: data.getUint8(offset + 5, true),
    };
    offset += INDEX_HEADER_SIZE;

    // Read resource files and entries
    // Read number of resource files (castaway only uses a single one)
    let innerOffset = offset;
    for (let r = 0; r < header.numResources; r += 1) {
        const res = {
            name: getString(data, innerOffset, INDEX_STRING_SIZE),
            numEntries: data.getUint16(innerOffset + 13, true),
            size: 0,
            entries: [],
        };
        resources.push(res);
        innerOffset += 15;

        for (let e = 0; e < res.numEntries; e += 1) {
            // from index
            const entrySize = data.getUint16(innerOffset, true); // uncompressed size
            const entryOffset = data.getUint32(innerOffset + 4, true);

            const entry = {
                type: name.split('.')[1],
                size: entrySize, // uncompressed size
                offset: entryOffset,
            };
            innerOffset += 8;

            res.entries.push(entry);
        }
    }

    return {
        header,
        resources
    };
};

/**
 * Load all Resource details based on index resource file
 * @param {*} filepath Full path of the file
 * @param {*} filename File name
 */
export const loadResourcebyName = (resource, resbuffer) => {
    const res = { ...resource };
    res.size = resbuffer.byteLength;
    const resData = new DataView(resbuffer, 0, res.size);

    for (let e = 0; e < res.numEntries; e += 1) {
        const entry = res.entries[e];
        const name = getString(resData, entry.offset, INDEX_STRING_SIZE);
        const entryCompressedSize = resData.getUint32(entry.offset + 13, true);
        const startOffset = entry.offset + 17;
        const endOffset = startOffset + entryCompressedSize;

        entry.name = name;
        entry.type = name.split('.')[1];
        entry.compressedSize = entryCompressedSize;
        entry.buffer = resbuffer.slice(startOffset, endOffset);
        entry.data = new DataView(resbuffer, startOffset, entryCompressedSize);

        res.entries.push({ ...entry });
    }

    return res;
};

export const loadResourceEntry = (entry) => {
    const resType = ResourceType.find((r) => r.type === entry.type);
    return resType.callback(entry);
};

/**
 * Load all Resource details based on index resource file
 * @param {*} filepath Full path of the file
 * @param {*} filename File name
 */
export function loadResources(buffer, resbuffer) {
    let offset = 0; // current resource offest
    const resources = []; // list of resource files
    const data = new DataView(buffer, offset, buffer.byteLength);

    const header = {
        unk0: data.getUint8(offset, true),
        unk1: data.getUint8(offset + 1, true), // number of entries?
        unk2: data.getUint8(offset + 2, true),
        unk3: data.getUint8(offset + 3, true),
        numResources: data.getUint8(offset + 4, true),
        unk5: data.getUint8(offset + 5, true),
    };
    offset += INDEX_HEADER_SIZE;

    // Read resource files and entries
    // Read number of resource files (castaway only uses a single one)
    for (let r = 0; r < header.numResources; r += 1) {
        let innerOffset = offset;
        const res = {
            name: getString(data, innerOffset, INDEX_STRING_SIZE),
            numEntries: data.getUint16(innerOffset + 13, true),
            size: 0,
            entries: [],
        };
        resources.push(res);
        innerOffset += 15;

        res.size = resbuffer.byteLength;
        const resData = new DataView(resbuffer, 0, res.size);

        for (let e = 0; e < res.numEntries; e += 1) {
            // from index
            const entrySize = data.getUint16(innerOffset, true); // uncompressed size
            const entryOffset = data.getUint32(innerOffset + 4, true);
            // from resource
            const name = getString(resData, entryOffset, INDEX_STRING_SIZE);
            const entryCompressedSize = resData.getUint32(entryOffset + 13, true);
            const startOffset = entryOffset + 17;
            const endOffset = startOffset + entryCompressedSize;

            const entry = {
                name,
                type: name.split('.')[1],
                size: entrySize, // uncompressed size
                offset: entryOffset,
                compressedSize: entryCompressedSize,
                buffer: resbuffer.slice(startOffset, endOffset),
                data: new DataView(resbuffer, startOffset, entryCompressedSize),
            };
            innerOffset += 8;

            res.entries.push(entry);
        }
    }

    return {
        header,
        resources
    };
}

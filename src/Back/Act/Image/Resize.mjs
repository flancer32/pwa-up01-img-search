/**
 * Action to resize saved image.
 *
 * @namespace App_Back_Act_Image_Resize
 */
// MODULE'S IMPORT
import {renameSync} from 'node:fs';
import sharp from "sharp";

// MODULE'S VARS
const NS = 'App_Back_Act_Image_Resize';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {App_Back_Defaults} */
    const DEF = spec['App_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {App_Back_Helper_Upload} */
    const hlpUpload = spec['App_Back_Helper_Upload$'];

    // VARS
    const MAX_HEIGHT = DEF.SHARED.RESIZE_HEIGHT;
    const MAX_WIDTH = DEF.SHARED.RESIZE_WIDTH;
    logger.setNamespace(NS);

    // FUNCS
    /**
     * Calculate new dimensions where new width is not more than MAX_WIDTH, new height is not more than MAX_HEIGHT and
     * the ratio of height and width after changes is not changed.
     *
     * @param {number} w original width of an image
     * @param {number} h original height of an image
     * @returns {{width: number, height: number}}
     */
    function calcDims(w, h) {
        if ((w <= MAX_WIDTH) && (h <= MAX_HEIGHT)) {
            return {width: w, height: h};
        } else {
            const ratio = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h);
            const width = Math.round(w * ratio);
            const height = Math.round(h * ratio);
            return {width, height};
        }
    }

    /**
     * Result function.
     *
     * @memberOf App_Back_Act_Image_Resize
     *
     * @param {string} path absolute path to original filename
     * @param {string} ext extension for file
     * @return {Promise<{file: string}>} full path to the file with extension
     */
    async function act({uuid, ext}) {
        const file = hlpUpload.uuidToPath(uuid);
        const path = `${file}.${ext}`;
        const image = await sharp(path);
        const meta = await image.metadata();
        const {width, height} = calcDims(meta.width, meta.height);
        if ((width !== meta.width) && (height !== meta.height)) {
            // resize original image
            image.resize({width, height});
            image.withMetadata();
            const pathResized = `${path}.new`;
            await image.toFile(pathResized);
            const pathOrig = `${path}.orig`;
            renameSync(path, pathOrig);
            renameSync(pathResized, path);
            logger.info(`File '${path}' is resized (${meta.width}*${meta.height} => ${width}*${height}).`);
        }
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
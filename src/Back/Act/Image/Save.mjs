/**
 * Action to save uploaded Base64 encoded image to filesystem.
 * Root folder for uploads is got from config (@flancer32/pwa-up01-img-search.uploadRoot)
 * or from `App_Back_Defaults.PATH_TO_UPLOADS`.
 *
 * First 2 chars from filename (uuid) are sub-folders in the root folder:
 *
 *
 * @namespace App_Back_Act_Image_Save
 */
// MODULE'S IMPORT
import {existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {join, isAbsolute} from 'node:path';

// MODULE'S VARS
const NS = 'App_Back_Act_Image_Save';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {App_Back_Defaults} */
    const DEF = spec['App_Back_Defaults$'];
    /** @type {TeqFw_Core_Back_Config} */
    const config = spec['TeqFw_Core_Back_Config$'];

    // VARS
    const _root = composeUploadRoot();

    // FUNCS
    /**
     * Compose path to root folder to store uploads and create folder if does not exist.
     * @returns {string}
     */
    function composeUploadRoot() {
        /** @type {App_Back_Plugin_Dto_Config_Local.Dto} */
        const cfgPlugin = config.getLocal(DEF.SHARED.NAME);
        const path = cfgPlugin?.uploadRoot ?? DEF.PATH_TO_UPLOADS;
        const prjRoot = config.getPathToRoot();
        const res = (isAbsolute(path)) ? path : join(prjRoot, path);
        if (!existsSync(res)) mkdirSync(res, {recursive: true});
        return res;
    }

    /**
     * Result function.
     *
     * @memberOf App_Back_Act_Image_Save
     *
     * @param {string} uuid to compose filename
     * @param {string} ext extension for file
     * @param {string} body base64 encoded string without prefix "data:image/jpeg;base64,"
     * @return {Promise<{file: string}>} full path to the file with extension
     */
    async function act({uuid, ext, body}) {
        const path = join(_root, uuid[0], uuid[1]);
        if (!existsSync(path)) mkdirSync(path, {recursive: true});
        const full = join(path, uuid);
        const file = `${full}.${ext}`;
        writeFileSync(file, body, {encoding: 'base64'});
        return {file};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
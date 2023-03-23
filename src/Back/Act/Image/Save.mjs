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
import {writeFileSync} from 'node:fs';

// MODULE'S VARS
const NS = 'App_Back_Act_Image_Save';

// MODULE'S FUNCS
/**
 * Default export is a factory to create result function in working environment (with deps).
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 */
export default function (spec) {
    // DEPS
    /** @type {App_Back_Helper_Upload} */
    const hlpUpload = spec['App_Back_Helper_Upload$'];

    // FUNCS
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
        const path = hlpUpload.uuidToPath(uuid);
        const file = `${path}.${ext}`;
        writeFileSync(file, body, {encoding: 'base64'});
        return {file};
    }

    // MAIN
    Object.defineProperty(act, 'namespace', {value: NS});
    return act;
}
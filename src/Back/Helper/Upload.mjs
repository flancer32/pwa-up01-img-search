/**
 * Helper to process filesystem related data.
 */
// MODULE'S IMPORT
import {isAbsolute, join} from 'node:path';
import {existsSync, mkdirSync} from 'node:fs';

// MODULE'S CLASSES
export default class App_Back_Helper_Upload {
    constructor(spec) {
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

        // INSTANCE METHODS
        /**
         * Convert `uuid` for uploaded file to absolute path:
         *   'fc35a08c-...48.png' => '/store/uploads/f/c/fc35a08c-...48.png'
         * @param {string} uuid filename with or w/o extension
         * @returns {string} absolute path to the file
         */
        this.uuidToPath = function (uuid) {
            const path = join(_root, uuid[0], uuid[1]);
            if (!existsSync(path)) mkdirSync(path, {recursive: true});
            return join(path, uuid);
        }

    }
}

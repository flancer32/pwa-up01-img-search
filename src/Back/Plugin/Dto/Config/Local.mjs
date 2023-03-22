/**
 * Local configuration DTO for the plugin.
 * @see TeqFw_Core_Back_Config
 */
// MODULE'S VARS
const NS = 'App_Back_Plugin_Dto_Config_Local';

// MODULE'S CLASSES
/**
 * @memberOf App_Back_Plugin_Dto_Config_Local
 */
class Dto {
    static namespace = NS;
    /**
     * Path to the root of uploaded files storage (relative to project root or absolute).
     * @type {string}
     */
    uploadRoot;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class App_Back_Plugin_Dto_Config_Local {
    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        /**
         * @param {App_Back_Plugin_Dto_Config_Local.Dto} data
         * @return {App_Back_Plugin_Dto_Config_Local.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.uploadRoot = castString(data?.uploadRoot);
            return res;
        }
    }
}
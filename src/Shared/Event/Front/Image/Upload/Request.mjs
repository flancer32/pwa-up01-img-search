/**
 * Upload image to backend.
 */
// MODULE'S VARS
const NS = 'App_Shared_Event_Front_Image_Upload_Request';

// MODULE'S CLASSES
/**
 * @memberOf App_Shared_Event_Front_Image_Upload_Request
 */
class Dto {
    static namespace = NS;
    /**
     * Base64 encoded image.
     * @type {string}
     */
    b64Image;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class App_Shared_Event_Front_Image_Upload_Request {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {App_Shared_Event_Front_Image_Upload_Request.Dto} [data]
         * @return {App_Shared_Event_Front_Image_Upload_Request.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.b64Image = castString(data?.b64Image);
            return res;
        }
    }
}

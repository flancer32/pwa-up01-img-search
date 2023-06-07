/**
 * Upload image to backend.
 */
// MODULE'S VARS
const NS = 'App_Shared_Web_Api_Image_Upload';

// MODULE'S CLASSES
/**
 * @memberOf App_Shared_Web_Api_Image_Upload
 */
class Request {
    static namespace = NS;
    /**
     * Base64 encoded image.
     * @type {string}
     */
    b64Image;
    /**
     * Latitude for geo position.
     * @type {number}
     */
    latitude;
    /**
     * Longitude for geo position.
     * @type {number}
     */
    longitude;
    /**
     * Title to use in search.
     * @type {string}
     */
    title;
}

/**
 * @memberOf App_Shared_Web_Api_Image_Upload
 */
class Response {
    static namespace = NS;
    /**
     * @type {App_Shared_Dto_Image.Dto}
     */
    item;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class App_Shared_Web_Api_Image_Upload {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDecimal|function} */
        const castDecimal = spec['TeqFw_Core_Shared_Util_Cast.castDecimal'];
        /** @type {App_Shared_Dto_Image} */
        const dtoImage = spec['App_Shared_Dto_Image$'];

        // INSTANCE METHODS

        /**
         * @param {App_Shared_Web_Api_Image_Upload.Request} [data]
         * @return {App_Shared_Web_Api_Image_Upload.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.b64Image = castString(data?.b64Image);
            res.latitude = castDecimal(data?.latitude);
            res.longitude = castDecimal(data?.longitude);
            res.title = castString(data?.title);
            return res;
        };

        /**
         * @param {App_Shared_Web_Api_Image_Upload.Response} [data]
         * @returns {App_Shared_Web_Api_Image_Upload.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.item = dtoImage.createDto(data?.item);
            return res;
        };
    }

}

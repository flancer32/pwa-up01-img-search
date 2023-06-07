/**
 * Get list of images from backend.
 */
// MODULE'S VARS
const NS = 'App_Shared_Web_Api_Image_List';

// MODULE'S CLASSES
/**
 * @memberOf App_Shared_Web_Api_Image_List
 */
class Request {
    static namespace = NS;
    /** @type {string} */
    searchKey;
}

/**
 * @memberOf App_Shared_Web_Api_Image_List
 */
class Response {
    static namespace = NS;
    /**
     * @type {App_Shared_Dto_Image.Dto[]}
     */
    items;
}

/**
 * @implements TeqFw_Web_Api_Shared_Api_Endpoint
 */
export default class App_Shared_Web_Api_Image_List {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfObj|function} */
        const castArrayOfObj = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfObj'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {App_Shared_Dto_Image} */
        const dtoImage = spec['App_Shared_Dto_Image$'];

        // INSTANCE METHODS

        /**
         * @param {App_Shared_Web_Api_Image_List.Request} [data]
         * @return {App_Shared_Web_Api_Image_List.Request}
         */
        this.createReq = function (data) {
            // create new DTO
            const res = new Request();
            // cast known attributes
            res.searchKey = castString(data?.searchKey);
            return res;
        };

        /**
         * @param {App_Shared_Web_Api_Image_List.Response} [data]
         * @returns {App_Shared_Web_Api_Image_List.Response}
         */
        this.createRes = function (data) {
            // create new DTO
            const res = new Response();
            // cast known attributes
            res.items = castArrayOfObj(data?.items, dtoImage.createDto);
            return res;
        };
    }

}

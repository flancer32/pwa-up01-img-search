/**
 * Image model to handle image in storages (CRUD-List).
 * @namespace App_Front_Mod_Image
 */
export default class App_Front_Mod_Image {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Api_Front_Web_Connect} */
        const connApi = spec['TeqFw_Web_Api_Front_Web_Connect$'];
        /** @type {App_Shared_Web_Api_Image_List} */
        const apiList = spec['App_Shared_Web_Api_Image_List$'];
        /** @type {App_Shared_Web_Api_Image_Upload} */
        const apiUpload = spec['App_Shared_Web_Api_Image_Upload$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // INSTANCE METHODS

        /**
         * Upload base64 encoded image to backend and return image DTO after image registration in DB.
         * @param {string} title
         * @param {string} base64
         * @param {number} lat latitude (-90, 90)
         * @param {number} long longitude (-180, 180)
         * @returns {Promise<App_Shared_Dto_Image.Dto>}
         */
        this.create = async function (title, base64, lat, long) {
            try {
                const req = apiUpload.createReq();
                req.b64Image = base64;
                req.title = title;
                req.latitude = lat;
                req.longitude = long;
                // noinspection JSValidateTypes
                /** @type {App_Shared_Web_Api_Image_Upload.Response} */
                const rs = await connApi.send(req, apiUpload);
                return (rs?.item) ? rs.item : null;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot upload image to backend. Error: ${e?.message}`);
            }
            return null;
        };

        /**
         * @param {string} [key]
         * @returns {Promise<App_Shared_Dto_Image.Dto[]>}
         */
        this.list = async function (key) {
            try {
                const req = apiList.createReq();
                req.searchKey = key;
                // noinspection JSValidateTypes
                /** @type {App_Shared_Web_Api_Image_List.Response} */
                const rs = await connApi.send(req, apiList);
                return rs?.items ?? [];
            } catch (e) {
                // timeout or error
                logger.error(`Cannot load list of uploads from backend. Error: ${e?.message}`);
            }
            return null;
        };
    }
}

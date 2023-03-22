/**
 * Image model to handle image in storages (CRUD-List).
 * @namespace App_Front_Mod_Image
 */
export default class App_Front_Mod_Image {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Event_Front_Act_Trans_Call.act|function} */
        const callTrans = spec['TeqFw_Web_Event_Front_Act_Trans_Call$'];
        /** @type {App_Shared_Event_Front_Image_Upload_Request} */
        const esfReqUpload = spec['App_Shared_Event_Front_Image_Upload_Request$'];
        /** @type {App_Shared_Event_Back_Image_Upload_Response} */
        const esbResUpload = spec['App_Shared_Event_Back_Image_Upload_Response$'];

        // MAIN
        logger.setNamespace(this.constructor.name);

        // FUNCS

        // INSTANCE METHODS

        /**
         * Upload base64 encoded image to backend and return image DTO after image registration in DB.
         * @param {string} title
         * @param {string} base64
         * @returns {Promise<number|null>}
         */
        this.create = async function (title, base64) {
            try {
                const req = esfReqUpload.createDto();
                req.b64Image = base64;
                req.title = title;
                /** @type {App_Shared_Event_Back_Image_Upload_Response.Dto} */
                const rs = await callTrans(req, esbResUpload);
                return (rs?.item) ? rs.item : null;
            } catch (e) {
                // timeout or error
                logger.error(`Cannot upload image to backend. Error: ${e?.message}`);
            }
            return null;
        }


    }
}

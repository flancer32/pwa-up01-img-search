/**
 * Response with DTO for uploaded image.
 */
// MODULE'S VARS
const NS = 'App_Shared_Event_Back_Image_Upload_Response';

// MODULE'S CLASSES
/**
 * @memberOf App_Shared_Event_Back_Image_Upload_Response
 */
class Dto {
    static namespace = NS;
    /**
     * @type {App_Shared_Dto_Image.Dto}
     */
    item;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class App_Shared_Event_Back_Image_Upload_Response {
    constructor(spec) {
        // DEPS
        /** @type {App_Shared_Dto_Image} */
        const dtoImage = spec['App_Shared_Dto_Image$'];

        // INSTANCE METHODS
        /**
         * @param {App_Shared_Event_Back_Image_Upload_Response.Dto} [data]
         * @return {App_Shared_Event_Back_Image_Upload_Response.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.item = dtoImage.createDto(data?.item);
            return res;
        }
    }
}

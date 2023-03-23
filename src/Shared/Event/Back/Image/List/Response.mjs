/**
 * Response with list of images.
 */
// MODULE'S VARS
const NS = 'App_Shared_Event_Back_Image_List_Response';

// MODULE'S CLASSES
/**
 * @memberOf App_Shared_Event_Back_Image_List_Response
 */
class Dto {
    static namespace = NS;
    /**
     * @type {App_Shared_Dto_Image.Dto[]}
     */
    items;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class App_Shared_Event_Back_Image_List_Response {
    constructor(spec) {
        // DEPS
        /** @type {App_Shared_Dto_Image} */
        const dtoImage = spec['App_Shared_Dto_Image$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castArrayOfObj|function} */
        const castArrayOfO = spec['TeqFw_Core_Shared_Util_Cast.castArrayOfObj'];

        // INSTANCE METHODS
        /**
         * @param {App_Shared_Event_Back_Image_List_Response.Dto} [data]
         * @return {App_Shared_Event_Back_Image_List_Response.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.items = castArrayOfO(data?.items, dtoImage.createDto);
            return res;
        }
    }
}

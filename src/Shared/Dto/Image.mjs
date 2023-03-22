/**
 *  Image DTO.
 *  @namespace App_Shared_Dto_Image
 */
// MODULE'S VARS
const NS = 'App_Shared_Dto_Image';

/**
 * @memberOf App_Shared_Dto_Image
 * @type {Object}
 */
const ATTR = {
    BID: 'bid',
    BASE64: 'base64',
    DATE_CREATED: 'dateCreated',
};

Object.freeze(ATTR);

// MODULE'S CLASSES
/**
 * @memberOf App_Shared_Dto_Image
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    bid;
    /**
     * TODO: should we use base64 encoded body here? may be direct links would be better?
     * @type {string}
     */
    base64;
    /** @type {Date} */
    dateCreated;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto_Meta
 */
export default class App_Shared_Dto_Image {

    constructor(spec) {
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {App_Shared_Dto_Image.Dto} [data]
         * @return {App_Shared_Dto_Image.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.bid = castInt(data?.bid);
            res.base64 = castString(data?.base64);
            res.dateCreated = castDate(data?.dateCreated);
            return res;
        }

        this.getAttributes = () => ATTR;
    }
}

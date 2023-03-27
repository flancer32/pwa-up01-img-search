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
    DATE_CREATED: 'dateCreated',
    EXT: 'ext',
    TITLE: 'title',
    UUID: 'uuid',
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
    /** @type {Date} */
    dateCreated;
    /**
     * Default extension for the file (by MIME).
     * @type {string}
     */
    ext;
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
     * Image title to use in searches.
     * @type {string}
     */
    title;
    /**
     * UUID as new name for uploaded file.
     * @type {string}
     */
    uuid;
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
        /** @type {TeqFw_Core_Shared_Util_Cast.castDecimal|function} */
        const castDecimal = spec['TeqFw_Core_Shared_Util_Cast.castDecimal'];
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
            res.dateCreated = castDate(data?.dateCreated);
            res.ext = castString(data?.ext);
            res.latitude = castDecimal(data?.latitude);
            res.longitude = castDecimal(data?.longitude);
            res.title = castString(data?.title);
            res.uuid = castString(data?.uuid);
            return res;
        }

        this.getAttributes = () => ATTR;
    }
}

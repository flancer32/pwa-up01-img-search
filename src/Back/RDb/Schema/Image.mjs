/**
 *  Metadata for RDB entity: uploaded image.
 *  @namespace App_Back_RDb_Schema_Image
 */
// MODULE'S VARS
const NS = 'App_Back_RDb_Schema_Image';
/**
 * Path to the entity in plugin's DEM.
 * @type {string}
 */
const ENTITY = '/app/image';

/**
 * @memberOf App_Back_RDb_Schema_Image
 * @type {Object}
 */
const ATTR = {
    BID: 'bid',
    DATE_CREATED: 'date_created',
    EXT: 'ext',
    LATITUDE: 'latitude',
    LONGITUDE: 'longitude',
    TITLE: 'title',
    UUID: 'uuid',
};

// MODULE'S CLASSES
/**
 * @memberOf App_Back_RDb_Schema_Image
 */
class Dto {
    static namespace = NS;
    /** @type {number} */
    bid;
    /**
     * UTC date-time when image was uploaded.
     * @type {Date}
     */
    date_created;
    /**
     * Default extension for the file (by MIME).
     * @type {string}
     */
    ext;
    /**
     * Latitude for geo coordinates (-90*10^6, 90*10^6).
     * @type {number}
     */
    latitude;
    /**
     * Longitude for geo coordinates (-180*10^6, 180*10^6).
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

// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Db_Back_RDb_Meta_IEntity
 */
export default class App_Back_RDb_Schema_Image {
    constructor(spec) {
        // DEPS
        /** @type {App_Back_Defaults} */
        const DEF = spec['App_Back_Defaults$'];
        /** @type {TeqFw_Db_Back_RDb_Schema_EntityBase} */
        const base = spec['TeqFw_Db_Back_RDb_Schema_EntityBase$'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];

        // INSTANCE METHODS
        /**
         * @param {App_Back_RDb_Schema_Image.Dto} [data]
         * @return {App_Back_RDb_Schema_Image.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.bid = castInt(data?.bid);
            res.date_created = castDate(data?.date_created);
            res.ext = castString(data?.ext);
            res.latitude = castInt(data?.latitude);
            res.longitude = castInt(data?.longitude);
            res.title = castString(data?.title);
            res.uuid = castString(data?.uuid);
            return res;
        }

        /**
         * @return {typeof App_Back_RDb_Schema_Image.ATTR}
         */
        this.getAttributes = () => ATTR;

        // MAIN
        return base.create(this,
            `${DEF.SHARED.NAME}${ENTITY}`,
            ATTR,
            [ATTR.BID],
            Dto
        );
    }
}

// finalize code components for this es6-module
Object.freeze(ATTR);

/**
 * Convert image related structures on the back (Shared, RDB, ...).
 */
export default class App_Back_Convert_Image {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Util_Cast.castDate|function} */
        const castDate = spec['TeqFw_Core_Shared_Util_Cast.castDate'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castInt|function} */
        const castInt = spec['TeqFw_Core_Shared_Util_Cast.castInt'];
        /** @type {TeqFw_Core_Shared_Util_Cast.castString|function} */
        const castString = spec['TeqFw_Core_Shared_Util_Cast.castString'];
        /** @type {App_Back_RDb_Schema_Image} */
        const rdb = spec['App_Back_RDb_Schema_Image$'];
        /** @type {App_Shared_Dto_Image} */
        const shared = spec['App_Shared_Dto_Image$'];

        // INSTANCE METHODS

        /**
         * @param {App_Back_RDb_Schema_Image.Dto} data
         * @returns {App_Shared_Dto_Image.Dto}
         */
        this.rdb2share = function (data) {
            const res = shared.createDto();
            res.bid = castInt(data?.bid);
            res.dateCreated = castDate(data?.date_created);
            res.ext = castString(data?.ext);
            res.title = castString(data?.title);
            res.uuid = castString(data?.uuid);
            return res;
        }

        /**
         * @param {App_Shared_Dto_Image.Dto} data
         * @returns {App_Back_RDb_Schema_Image.Dto}
         */
        this.share2rdb = function (data) {
            const res = rdb.createDto();
            res.bid = castInt(data?.bid);
            res.date_created = castDate(data?.dateCreated);
            res.ext = castString(data?.ext);
            res.title = castString(data?.title);
            res.uuid = castString(data?.uuid);
            return res;
        }

    }
}

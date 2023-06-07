/**
 * Select list of uploaded images according to given criteria.
 */
// MODULE'S CLASSES
/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class App_Back_Web_Api_Image_List {
    constructor(spec) {
        // DEPS
        /** @type {App_Back_Defaults} */
        const DEF = spec['App_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {App_Shared_Web_Api_Image_List} */
        const endpoint = spec['App_Shared_Web_Api_Image_List$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {App_Back_RDb_Schema_Image} */
        const rdbImage = spec['App_Back_RDb_Schema_Image$'];
        /** @type {App_Back_Convert_Image} */
        const convImage = spec['App_Back_Convert_Image$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_IMG = rdbImage.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {App_Shared_Web_Api_Image_List.Request|Object} req
         * @param {App_Shared_Web_Api_Image_List.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                const key = req.searchKey;
                // select data from RDB
                const where = (key)
                    ? (b) => b.whereLike(trx.raw(`LOWER(${A_IMG.TITLE})`), `%${key.trim().toLowerCase()}%`)
                    : null;
                const order = [{column: A_IMG.DATE_CREATED, order: 'desc'}];
                const limit = DEF.SHARED.LIST_LIMIT;
                const rs = await crud.readSet(trx, rdbImage, where, null, order, limit);
                const items = [];
                for (const one of rs) items.push(convImage.rdb2share(one));
                res.items = items;
                //
                await trx.commit();
                logger.info(`loaded ${res?.items?.length} items`);
            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}

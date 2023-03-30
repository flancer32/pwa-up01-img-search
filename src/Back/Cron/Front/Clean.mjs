/**
 * Clean up fronts that been not connected too long time (more than 365 days).
 */
// MODULE'S VARS
const TIMEOUT_LOOP = 86400000; // launch clean up every 1 day (86400 sec)
const THRESHOLD_SESS_DAYS = 365; // number of days to clean up expired sessions

// MODULE'S CLASSES
export default class App_Back_Cron_Front_Clean {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Core_Shared_Util_Date.subtractDays|function} */
        const subtractDays = spec['TeqFw_Core_Shared_Util_Date.subtractDays'];
        /** @type {TeqFw_Db_Back_Util.dateUtc|function} */
        const dateUtc = spec['TeqFw_Db_Back_Util.dateUtc'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front} */
        const rdbFront = spec['TeqFw_Web_Event_Back_RDb_Schema_Front$'];
        /** @type {TeqFw_Web_Event_Back_RDb_Schema_Front_Session} */
        const rdbSess = spec['TeqFw_Web_Event_Back_RDb_Schema_Front_Session$'];


        // VARS
        const A_FRONT = rdbFront.getAttributes();
        const A_SESS = rdbSess.getAttributes();
        logger.setNamespace(this.constructor.name);
        let _idTimeout;

        // FUNCS

        async function iteration() {
            // FUNCS
            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @returns {Promise<void>}
             */
            async function cleanFronts(trx) {
                // FUNCS
                function buildSelect(trx) {
                    const TBL = {
                        FRONT: 'f',
                        SESS: 's',
                    };
                    const COL = {
                        FRONT_ID: ' frontId',
                    };
                    const tFront = {[TBL.FRONT]: trx.getTableName(rdbFront)};
                    const tSess = {[TBL.SESS]: trx.getTableName(rdbSess)};

                    /** @type {Knex.QueryBuilder} */
                    const query = trx.createQuery();
                    // fronts
                    query.table(tFront);
                    // sessions
                    query.leftJoin(tSess, `${TBL.SESS}.${A_SESS.FRONT_REF}`, `${TBL.FRONT}.${A_FRONT.BID}`);
                    // SELECT
                    query.select({[COL.FRONT_ID]: `${TBL.FRONT}.${A_FRONT.BID}`},);
                    // WHERE
                    query.where((builder) => builder.whereNull(`${TBL.SESS}.${A_SESS.BID}`));
                    return query;
                }

                // MAIN
                const qSelect = buildSelect(trx);
                const query = trx.createQuery();
                query.table(trx.getTableName(rdbFront));
                query.whereIn(A_FRONT.BID, qSelect);
                query.del();
                const del = await query;
                if (del) logger.info(`Total ${del} fronts where removed on clean up.`);
            }

            /**
             * @param {TeqFw_Db_Back_RDb_ITrans} trx
             * @returns {Promise<void>}
             */
            async function cleanSessions(trx) {
                const date = subtractDays(THRESHOLD_SESS_DAYS);
                const where = (builder) => builder.where(A_SESS.DATE_CONNECTED, '<=', dateUtc(date));
                const del = await crud.deleteSet(trx, rdbSess, where);
                if (del) logger.info(`Total ${del} sessions where removed on clean up.`);
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                await cleanSessions(trx);
                await cleanFronts(trx);
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
            // setup next iteration
            _idTimeout = setTimeout(iteration, TIMEOUT_LOOP);
        }

        // INSTANCE METHODS

        /**
         * Start events generation.
         * @returns {Promise<void>}
         */
        this.start = async function () {
            iteration().catch(logger.error);
            logger.info(`The clean up of expired fronts is started.`);
        }

        /**
         * Clear timeout and stop events generation.
         */
        this.stop = function () {
            if (_idTimeout) {
                clearTimeout(_idTimeout);
                logger.info(`The clean up of expired fronts is stopped.`);
            }
        }
    }
}

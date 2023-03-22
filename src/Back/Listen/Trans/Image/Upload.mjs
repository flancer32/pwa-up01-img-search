/**
 * Save uploaded image to disk and registry it to DB.
 */
export default class App_Back_Listen_Trans_Image_Upload {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Event_Back_Mod_Channel} */
        const eventsBack = spec['TeqFw_Web_Event_Back_Mod_Channel$'];
        /** @type {TeqFw_Web_Event_Back_Mod_Portal_Front} */
        const portalFront = spec['TeqFw_Web_Event_Back_Mod_Portal_Front$'];
        /** @type {App_Shared_Event_Front_Image_Upload_Request} */
        const esfReq = spec['App_Shared_Event_Front_Image_Upload_Request$'];
        /** @type {App_Shared_Event_Back_Image_Upload_Response} */
        const esbRes = spec['App_Shared_Event_Back_Image_Upload_Response$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
        /** @type {App_Shared_Dto_Image} */
        const dtoImage = spec['App_Shared_Dto_Image$'];

        // MAIN
        // const A_EVT = rdbEvt.getAttributes();
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfReq, handler)

        // FUNCS
        /**
         * @param {App_Shared_Event_Front_Image_Upload_Request.Dto} dataIn
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} metaIn
         */
        async function handler({data: dataIn, meta: metaIn}) {
            // FUNCS


            // MAIN
            const data = esbRes.createDto();
            const {meta} = portalFront.createMessage();
            meta.sessionUuid = metaIn.sessionUuid;
            meta.requestUuid = metaIn.uuid; // bind request UUID to response
            //
            const trx = await conn.startTransaction();
            try {
                const image = dtoImage.createDto();
                image.bid = 32;
                data.item = image;
                //
                await trx.commit();
                logger.info(`${esbRes.constructor.name}: ${JSON.stringify(data)}`);
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
            // publish response (if it exists) to front to break waiting on error
            // noinspection JSCheckFunctionSignatures
            await portalFront.publish({data, meta});
        }
    }
}

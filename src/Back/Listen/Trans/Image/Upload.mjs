/**
 * Save uploaded image to disk and registry it to DB.
 */
// MODULE'S IMPORT
import {randomUUID} from 'node:crypto';
import {extension} from 'mime-types';

// MODULE'S CLASSES
export default class App_Back_Listen_Trans_Image_Upload {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {App_Shared_Util.geoDec2Int|function} */
        const geoDec2Int = spec['App_Shared_Util.geoDec2Int'];
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
        /** @type {App_Back_RDb_Schema_Image} */
        const rdbImage = spec['App_Back_RDb_Schema_Image$'];
        /** @type {App_Shared_Dto_Image} */
        const dtoImage = spec['App_Shared_Dto_Image$'];
        /** @type {App_Back_Act_Image_Resize.act|function} */
        const actResize = spec['App_Back_Act_Image_Resize$'];
        /** @type {App_Back_Act_Image_Save.act|function} */
        const actSave = spec['App_Back_Act_Image_Save$'];

        // MAIN
        const A_IMG = rdbImage.getAttributes();
        logger.setNamespace(this.constructor.name);
        eventsBack.subscribe(esfReq, handler)

        // FUNCS
        /**
         * @param {App_Shared_Event_Front_Image_Upload_Request.Dto} dataIn
         * @param {TeqFw_Web_Event_Shared_Dto_Event_Meta_Trans.Dto} metaIn
         */
        async function handler({data: dataIn, meta: metaIn}) {
            // FUNCS
            function splitB64(b64) {
                const parts = b64.split(';base64,');
                const body = parts.pop();
                const mime = parts[0].split(':').pop();
                const ext = extension(mime);
                return {ext, body};
            }

            // MAIN
            const data = esbRes.createDto();
            const {meta} = portalFront.createMessage();
            meta.sessionUuid = metaIn.sessionUuid;
            meta.requestUuid = metaIn.uuid; // bind request UUID to response
            //
            const trx = await conn.startTransaction();
            try {
                // normalize data
                const title = dataIn?.title;
                const b64 = dataIn?.b64Image;
                const latitude = geoDec2Int(dataIn?.latitude);
                const longitude = geoDec2Int(dataIn?.longitude);
                //
                const uuid = randomUUID();
                const {ext, body} = splitB64(b64);
                // save data to filesystem
                await actSave({uuid, ext, body});
                await actResize({uuid, ext});
                // save data to RDB
                const dto = rdbImage.createDto();
                dto.uuid = uuid;
                dto.ext = ext;
                dto.latitude = latitude;
                dto.longitude = longitude;
                dto.title = title; //.toLowerCase();
                const {[A_IMG.BID]: bid} = await crud.create(trx, rdbImage, dto);
                /** @type {App_Back_RDb_Schema_Image.Dto} */
                const saved = await crud.readOne(trx, rdbImage, bid);
                // prepare response
                const image = dtoImage.createDto();
                image.bid = saved.bid;
                image.title = saved.title;
                image.dateCreated = saved.date_created;
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

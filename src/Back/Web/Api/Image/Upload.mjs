/**
 * Save uploaded image to disk and registry it to DB.
 */
// MODULE'S CLASSES
import {randomUUID} from 'node:crypto';
import {extension} from 'mime-types';

/**
 * @implements TeqFw_Web_Api_Back_Api_Service
 */
export default class App_Back_Web_Api_Image_Upload {
    constructor(spec) {
        // DEPS
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {App_Shared_Web_Api_Image_Upload} */
        const endpoint = spec['App_Shared_Web_Api_Image_Upload$'];
        /** @type {TeqFw_Db_Back_RDb_IConnect} */
        const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
        /** @type {TeqFw_Db_Back_Api_RDb_CrudEngine} */
        const crud = spec['TeqFw_Db_Back_Api_RDb_CrudEngine$'];
        /** @type {App_Shared_Util.geoDec2Int|function} */
        const geoDec2Int = spec['App_Shared_Util.geoDec2Int'];
        /** @type {App_Back_Act_Image_Resize.act|function} */
        const actResize = spec['App_Back_Act_Image_Resize$'];
        /** @type {App_Back_Act_Image_Save.act|function} */
        const actSave = spec['App_Back_Act_Image_Save$'];
        /** @type {App_Back_RDb_Schema_Image} */
        const rdbImage = spec['App_Back_RDb_Schema_Image$'];
        /** @type {App_Shared_Dto_Image} */
        const dtoImage = spec['App_Shared_Dto_Image$'];

        // VARS
        logger.setNamespace(this.constructor.name);
        const A_IMG = rdbImage.getAttributes();

        // INSTANCE METHODS

        this.getEndpoint = () => endpoint;

        this.init = async function () { };

        /**
         * @param {App_Shared_Web_Api_Image_Upload.Request|Object} req
         * @param {App_Shared_Web_Api_Image_Upload.Response|Object} res
         * @param {TeqFw_Web_Api_Back_Api_Service_Context} context
         * @returns {Promise<void>}
         */
        this.process = async function (req, res, context) {
            // FUNCS
            function splitB64(b64) {
                const parts = b64.split(';base64,');
                const body = parts.pop();
                const mime = parts[0].split(':').pop();
                const ext = extension(mime);
                return {ext, body};
            }

            // MAIN
            const trx = await conn.startTransaction();
            try {
                // get and normalize input data
                // normalize data
                const title = req?.title;
                const b64 = req?.b64Image;
                const latitude = geoDec2Int(req?.latitude);
                const longitude = geoDec2Int(req?.longitude);
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
                res.item = image;
                //
                await trx.commit();
                logger.info(JSON.stringify(res));

            } catch (error) {
                logger.error(error);
                await trx.rollback();
            }
        };
    }

}

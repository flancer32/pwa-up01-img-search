/**
 * Remove one or all uploaded images.
 *
 * @namespace App_Back_Cli_Image_Remove
 */
// MODULE'S IMPORT
import {join} from 'node:path';
import {existsSync, rmdirSync, unlinkSync} from "node:fs";

// MODULE'S VARS
const NS = 'App_Back_Cli_Image_Remove';
const OPT_ALL = 'all';
const OPT_BID = 'bid';
const OPT_UUID = 'uuid';

// MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {TeqFw_Di_Shared_SpecProxy} spec
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @constructor
 * @memberOf App_Back_Cli_Image_Remove
 */
export default function Factory(spec) {
    // DEPS
    /** @type {App_Back_Defaults} */
    const DEF = spec['App_Back_Defaults$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {TeqFw_Core_Back_App} */
    const app = spec['TeqFw_Core_Back_App$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command.Factory} */
    const fCommand = spec['TeqFw_Core_Back_Api_Dto_Command.Factory$'];
    /** @type {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} */
    const fOpt = spec['TeqFw_Core_Back_Api_Dto_Command_Option#Factory$'];
    /** @type {TeqFw_Db_Back_RDb_IConnect} */
    const conn = spec['TeqFw_Db_Back_RDb_IConnect$'];
    /** @type {TeqFw_Db_Back_Api_RDb_ICrudEngine} */
    const crud = spec['TeqFw_Db_Back_Api_RDb_ICrudEngine$'];
    /** @type {App_Back_RDb_Schema_Image} */
    const rdbImage = spec['App_Back_RDb_Schema_Image$'];
    /** @type {App_Back_Helper_Upload} */
    const hlpUpload = spec['App_Back_Helper_Upload$'];

    // VARS
    const A_IMG = rdbImage.getAttributes();
    logger.setNamespace(NS);

    // FUNCS

    /**
     * Command action.
     * @param {Object} opts
     * @returns {Promise<void>}
     * @memberOf App_Back_Cli_Image_Remove
     */
    async function action(opts) {

        // FUNCS
        /**
         * Remove one image from RDB & filesystem.
         * @param {TeqFw_Db_Back_RDb_ITrans} trx
         * @param {App_Back_RDb_Schema_Image.Dto} dto
         * @returns {Promise<void>}
         */
        async function removeImage(trx, dto) {
            const deleted = await crud.deleteOne(trx, rdbImage, dto.bid);
            if (deleted) logger.info(`Image #${dto.bid} (${dto.uuid}) is removed from RDB.`);
            const path = hlpUpload.uuidToPath(dto.uuid);
            const file = `${path}.${dto.ext}`;
            if (existsSync(file)) {
                unlinkSync(file);
                logger.info(`Image '${file}' is removed.`)
            }
            // silently try to remove empty directories
            const level1 = join(file, '..');
            try {
                rmdirSync(level1);
                logger.info(`Directory '${level1}' is removed.`)
            } catch (e) {
                // directory is not empty
            }
            const level2 = join(level1, '..');
            try {
                rmdirSync(level2);
                logger.info(`Directory '${level2}' is removed.`)
            } catch (e) {
                // directory is not empty
            }
        }

        async function removeAll() {
            logger.info(`Removal of all images is requested.`);
            const trx = await conn.startTransaction();
            try {
                const deleted = await crud.deleteSet(trx, rdbImage);
                if (deleted) logger.info(`Total '${deleted}' images are deleted from RDB.`);
                hlpUpload.clearUploads();
                logger.info(`Removal of all images is requested.`);
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }

        /**
         * @param {number} bid
         * @returns {Promise<void>}
         */
        async function removeByBid(bid) {
            logger.info(`Removal for image with bid=${bid} is requested.`);
            const trx = await conn.startTransaction();
            try {
                /** @type {App_Back_RDb_Schema_Image.Dto} */
                const found = await crud.readOne(trx, rdbImage, bid);
                if (found) await removeImage(trx, found);
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }

        /**
         * @param {string} uuid
         * @returns {Promise<void>}
         */
        async function removeByUuid(uuid) {
            logger.info(`Removal for image with uuid=${uuid} is requested.`);
            const trx = await conn.startTransaction();
            try {
                /** @type {App_Back_RDb_Schema_Image.Dto} */
                const found = await crud.readOne(trx, rdbImage, {[A_IMG.UUID]: uuid});
                if (found) await removeImage(trx, found);
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                logger.error(error);
            }
        }

        // MAIN
        // get options
        const all = opts[OPT_ALL];
        const bid = opts[OPT_BID];
        const uuid = opts[OPT_UUID];
        // perform requested operation
        if (bid) await removeByBid(bid);
        else if (uuid) await removeByUuid(uuid);
        else if (all) await removeAll();
        else logger.info('Nothing to remove.');
        logger.info('Command is completed.');
        await app.stop();
    }

    Object.defineProperty(action, 'namespace', {value: NS});

    // MAIN
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'image-remove';
    res.desc = 'Remove one or all uploaded images.';
    res.action = action;
    // add option --bid
    const optAll = fOpt.create();
    optAll.flags = `-a, --${OPT_ALL}`;
    optAll.description = `remove all uploaded images.`;
    res.opts.push(optAll);
    // add option --bid
    const optBid = fOpt.create();
    optBid.flags = `-b, --${OPT_BID} <backendId>`;
    optBid.description = `remove one uploaded image by backend ID (number).`;
    res.opts.push(optBid);
    // add option --uuid
    const optUuid = fOpt.create();
    optUuid.flags = `-u, --${OPT_UUID} <uuid>`;
    optUuid.description = `remove one uploaded image by UUID (string).`;
    res.opts.push(optUuid);
    return res;
}

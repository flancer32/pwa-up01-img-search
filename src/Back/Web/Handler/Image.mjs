/**
 * Web server handler to get uploaded images from the back.
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';

// MODULE'S VARS
const NS = 'App_Back_Web_Handler_Image';
const {
    HTTP2_METHOD_GET,
    HTTP_STATUS_OK,
} = H2;


// MODULE'S CLASSES
// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class App_Back_Web_Handler_Image {
    constructor(spec) {
        // DEPS
        /** @type {App_Back_Defaults} */
        const DEF = spec['App_Back_Defaults$'];
        /** @type {TeqFw_Core_Shared_Api_Logger} */
        const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
        /** @type {TeqFw_Web_Back_App_Server_Respond.respond500|function} */
        const respond500 = spec['TeqFw_Web_Back_App_Server_Respond.respond500'];
        /** @type {TeqFw_Web_Back_Mod_Address} */
        const modAddress = spec['TeqFw_Web_Back_Mod_Address$'];
        /** @type {App_Back_Helper_Upload} */
        const hlpUpload = spec['App_Back_Helper_Upload$'];

        // MAIN
        Object.defineProperty(process, 'namespace', {value: NS});
        logger.setNamespace(this.constructor.name);

        // FUNCS
        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest}req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf App_Back_Web_Handler_Image
         */
        async function process(req, res) {
            // FUNCS
            /**
             * Compose absolute path to requested image.
             * @param {String} url
             * @returns {String}
             */
            function getFilesystemPath(url) {
                const parts = url.split('?'); // cut off GET vars
                const address = modAddress.parsePath(parts[0]);
                const filename = address.route.replaceAll('/', '');
                return hlpUpload.uuidToPath(filename);
            }

            // MAIN
            /** @type {Object} */
            const shares = res[DEF.MOD_WEB.HNDL_SHARE];
            if (!res.headersSent && !shares[DEF.MOD_WEB.SHARE_RES_STATUS]) {
                try {
                    shares[DEF.MOD_WEB.SHARE_RES_FILE] = getFilesystemPath(req.url);
                    shares[DEF.MOD_WEB.SHARE_RES_STATUS] = HTTP_STATUS_OK;
                } catch (e) {
                    respond500(res, e?.message);
                }
            }
        }

        // INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () {
            logger.info(`Initialize uploaded images handler for web requests.`);
        };

        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_GET)
                && (address?.space === DEF.SHARED.SPACE_IMAGE)
            );
        };
    }
}

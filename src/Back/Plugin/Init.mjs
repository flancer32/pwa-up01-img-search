/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'App_Back_Plugin_Init';

export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {App_Back_Cron_Front_Clean} */
    const cronFrontClean = spec['App_Back_Cron_Front_Clean$'];

    // VARS
    logger.setNamespace(NS);

    // FUNCS
    async function init() {
        // create event listeners synchronously to prevent doubling of singletons in container
        await container.get('App_Back_Listen_Trans_Image_List$');
        await container.get('App_Back_Listen_Trans_Image_Upload$');
        // run scheduled tasks
        cronFrontClean.start().catch(logger.error);
    }

    // MAIN
    Object.defineProperty(init, 'namespace', {value: NS});
    return init;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});

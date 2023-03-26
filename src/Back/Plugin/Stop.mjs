/**
 * Plugin finalization function.
 */
// MODULE'S VARS
const NS = 'App_Back_Plugin_Stop';

export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Core_Shared_Api_Logger} */
    const logger = spec['TeqFw_Core_Shared_Api_Logger$$']; // instance
    /** @type {App_Back_Cron_Front_Clean} */
    const cronFrontClean = spec['App_Back_Cron_Front_Clean$'];

    // COMPOSE RESULT
    async function exec() {
        // stop scheduled tasks
        cronFrontClean.stop();
        logger.info(`Image upload application is stopped.`);
    }

    Object.defineProperty(exec, 'namespace', {value: NS});
    return exec;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});

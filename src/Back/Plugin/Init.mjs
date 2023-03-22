/**
 * Plugin initialization function.
 */
// MODULE'S VARS
const NS = 'App_Back_Plugin_Init';

export default function Factory(spec) {
    // DEPS
    /** @type {TeqFw_Di_Shared_Container} */
    const container = spec['TeqFw_Di_Shared_Container$'];

    // FUNCS
    async function init() {
        // create event listeners synchronously to prevent doubling of singletons in container
        await container.get('App_Back_Listen_Trans_Image_Upload$');
    }

    // MAIN
    Object.defineProperty(init, 'namespace', {value: NS});
    return init;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});

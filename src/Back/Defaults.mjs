/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class App_Back_Defaults {

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    /** @type {App_Shared_Defaults} */
    SHARED;

    constructor(spec) {
        this.MOD_WEB = spec['TeqFw_Web_Back_Defaults$'];
        this.SHARED = spec['App_Shared_Defaults$'];
        Object.freeze(this);
    }
}

/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class App_Shared_Defaults {
    NAME = '@flancer32/pwa-up01-img-search';
    GEO_MULT = 1000000; // multiplier for geo coordinates to save as integer
    SPACE_IMAGE = 'app-image';

    constructor() {
        Object.freeze(this);
    }
}

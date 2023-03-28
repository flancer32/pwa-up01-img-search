/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class App_Shared_Defaults {
    NAME = '@flancer32/pwa-up01-img-search';

    GEO_MULT = 1000000; // multiplier for geo coordinates to save as integer

    RESIZE_HEIGHT = 1080; // max width for stored uploads
    RESIZE_WIDTH = 1080; // max height for stored uploads

    SPACE_IMAGE = 'app-image';

    constructor() {
        Object.freeze(this);
    }
}

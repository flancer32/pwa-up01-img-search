/**
 * Set of utilities to use on front and back.
 * @namespace App_Shared_Util
 */
// MODULE'S IMPORTS
import Defaults from "./Defaults.mjs";

// MODULE'S VARS
const NS = 'App_Shared_Util';
const DEF = new Defaults();

// MODULE'S FUNCS
/**
 * 90.0 => 90000000
 * @param {number} data
 * @returns {number|null}
 * @memberOf App_Shared_Util
 */
function geoDec2Int(data) {
    return data ? Math.round(data * DEF.GEO_MULT) : null;
}

/**
 * 90000000 => 90.0
 * @param {number} data
 * @returns {number|null}
 * @memberOf App_Shared_Util
 */
function geoInt2Dec(data) {
    return data ? data / DEF.GEO_MULT : null;
}

// MAIN
// finalize code components for this es6-module
Object.defineProperty(geoDec2Int, 'namespace', {value: NS});
Object.defineProperty(geoInt2Dec, 'namespace', {value: NS});

export {
    geoDec2Int,
    geoInt2Dec,
}

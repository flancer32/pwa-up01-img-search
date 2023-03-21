/**
 * Screen for application's homepage.
 *
 * @namespace App_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Route_Home';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {App_Front_Ui_Route_Home.vueCompTmpl}
 */
export default function (spec) {
    /** @type {App_Front_Defaults} */
    const DEF = spec['App_Front_Defaults$'];

    // VARS
    const template = `
<div>
    <input v-model="text">
    <button class="btn large" v-on:click="onClick">click me</button>
</div>
`;
    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf App_Front_Ui_Route_Home
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {
                text: null,
            };
        },
        methods: {
            onClick() {
                console.log(`done.`);
            },
        },
        created() {

        },
    };
}

/**
 * UI component for dialog to display informational message.
 *
 * @namespace App_Front_Ui_Lib_Info
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Lib_Info';
const REF_SELF = 'self';
const TIMEOUT_HIDE = 2500;

// MODULE'S INTERFACES
// noinspection JSUnusedLocalSymbols
/**
 * @interface
 * @memberOf App_Front_Ui_Lib_Info
 */
class IUi {
    /**
     * @param {string} msg
     */
    show(msg) { }
}

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {App_Front_Ui_Lib_Info.vueCompTmpl}
 */
export default function (spec) {
    /** @type {App_Front_Defaults} */
    const DEF = spec['App_Front_Defaults$'];

    // VARS
    const template = `
<q-dialog ref="${REF_SELF}" position="bottom">
    <div class="info-container">
        <q-card class="info-card">
            <q-card-section class="text-center">
                {{message}}
            </q-card-section>
        </q-card>
    </div>
</q-dialog>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf App_Front_Ui_Lib_Info
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                message: null,
            };
        },
        computed: {},
        /**
         * @mixes App_Front_Ui_Lib_Info.IUi
         */
        methods: {
            hide() {
                // switch off Quasar dialog
                this.$refs[REF_SELF].hide();
            },
            async show(item) {
                this.message = item;
                // fire up Quasar dial
                this.$refs[REF_SELF].show();
                // delayed hide
                setTimeout(() => this.hide(), TIMEOUT_HIDE);
            },
        },
    };
}

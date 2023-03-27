/**
 * UI component for dialog to display one image.
 *
 * @namespace App_Front_Ui_Route_Home_A_Display
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Route_Home_A_Display';
const REF_SELF = 'self';

// MODULE'S INTERFACES
// noinspection JSUnusedLocalSymbols
/**
 * @interface
 * @memberOf App_Front_Ui_Route_Home_A_Display
 */
class IUi {
    /**
     * @param {App_Shared_Dto_Image.Dto} item
     */
    show(item) { }
}

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {App_Front_Ui_Route_Home_A_Display.vueCompTmpl}
 */
export default function (spec) {
    /** @type {App_Front_Defaults} */
    const DEF = spec['App_Front_Defaults$'];

    // VARS
    const template = `
<q-dialog ref="${REF_SELF}">
    <q-card class="img-display">
        <q-card-section class="header">
            <div class="">#{{origin?.bid}}</div>
            <div class="cursor-pointer">
                <q-icon name="cancel" color="${DEF.COLOR_Q_PRIMARY}" size="sm" v-on:click="hide">
            </div>
        </q-card-section>
        <!-- image -->
        <q-card-section class="cursor-pointer" v-on:click="onClick">
            <div class="text-center">
                <img :src="uiImgSource" :alt="uiTitle"/>
            </div>
        </q-card-section>
        <!-- data -->
        <q-card-section class="header">
            <div class="text-center">{{uiTitle}}</div>
            <div>
                <q-icon name="public" color="${DEF.COLOR_Q_PRIMARY}" v-if="ifGeo" size="sm" v-on:click="onMap">
            </div>
        </q-card-section>
    </q-card>
</q-dialog>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf App_Front_Ui_Route_Home_A_Display
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        data() {
            return {
                /** @type {App_Shared_Dto_Image.Dto} */
                origin: null,
            };
        },
        computed: {
            ifGeo() {
                return Boolean(this.origin?.latitude) && Boolean(this.origin?.longitude);
            },
            uiImgSource() {
                const filename = `${this.origin?.uuid}.${this.origin?.ext}`;
                return `/${DEF.SHARED.SPACE_IMAGE}/${filename}`;
            },
            uiTitle() {
                return this.origin?.title;
            }
        },
        /**
         * @mixes App_Front_Ui_Route_Home_A_Display.IUi
         */
        methods: {
            hide() {
                // switch off Quasar dialog
                this.$refs[REF_SELF].hide();
            },
            onClick() {
                const key = this.origin?.title.toLowerCase();
                const norm = encodeURI(key);
                window.open(`https://www.google.com/search?q=${norm}`, '_blank').focus();
            },
            onMap() {
                if (this.ifGeo) {
                    const url = `https://maps.google.com/?q=${this.origin?.latitude},${this.origin?.longitude}`;
                    window.open(url, '_blank').focus();
                }
            },
            async show(item) {
                this.origin = Object.assign({}, item);
                // fire up Quasar dial
                this.$refs[REF_SELF].show();
            },
        },
    };
}

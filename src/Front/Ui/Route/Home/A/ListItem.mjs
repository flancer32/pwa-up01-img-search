/**
 * UI component for one item of images list.
 *
 * @namespace App_Front_Ui_Route_Home_A_ListItem
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Route_Home_A_ListItem';
const EVT_CLICK = 'onClick';

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {App_Front_Ui_Route_Home_A_ListItem.vueCompTmpl}
 */
export default function (spec) {
    /** @type {App_Front_Defaults} */
    const DEF = spec['App_Front_Defaults$'];

    // VARS
    const template = `
<q-card class="cursor-pointer q-pa-xs" v-on:click="onClick">
    <div class="title">{{item.title}}</div>
    <div>
        <img :src="uiImgSource" :alt="item.title"/>
    </div>
</q-card>
`;

    // FUNCS


    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf App_Front_Ui_Route_Home_A_ListItem
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {},
        data() {
            return {};
        },
        props: {
            /** @type {App_Shared_Dto_Image.Dto} */
            item: null,
        },
        computed: {
            uiImgSource() {
                const filename = `${this.item.uuid}.${this.item.ext}`;
                return `/${DEF.SHARED.SPACE_IMAGE}/${filename}`;
            },
            uiSearchHref() {
                const key = this.item.title.toLowerCase();
                const norm = encodeURI(key);
                return `https://www.google.com/search?q=${norm}`;
            },
        },
        methods: {
            onClick() {
                this.$emit(EVT_CLICK, this.item);
            },
        },
    };
}

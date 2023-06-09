/**
 * Screen for application's homepage.
 *
 * @namespace App_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Route_Home';
const REF_DISPLAY = 'display';
const REF_INFO = 'info';
const REF_UPLOAD = 'upload';

// MODULE'S FUNCTIONS

/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {App_Front_Ui_Route_Home.vueCompTmpl}
 */
export default function (spec) {
    /** @type {App_Front_Defaults} */
    const DEF = spec['App_Front_Defaults$'];
    /** @type {App_Front_Mod_Image} */
    const modImg = spec['App_Front_Mod_Image$'];
    /** @type {App_Front_Ui_Lib_Info.vueCompTmpl} */
    const uiInfo = spec['App_Front_Ui_Lib_Info$'];
    /** @type {App_Front_Ui_Route_Home_A_ListItem.vueCompTmpl} */
    const uiItem = spec['App_Front_Ui_Route_Home_A_ListItem$'];
    /** @type {App_Front_Ui_Route_Home_A_Display.vueCompTmpl} */
    const uiDisplay = spec['App_Front_Ui_Route_Home_A_Display$'];
    /** @type {App_Front_Ui_Route_Home_A_Upload.vueCompTmpl} */
    const uiUpload = spec['App_Front_Ui_Route_Home_A_Upload$'];
    /** @type {App_Front_Widget_Info} */
    const wgInfo = spec['App_Front_Widget_Info$'];

    // VARS
    const template = `
<div class="col q-gutter-xs">
    <ui-display ref="${REF_DISPLAY}"/>
    <ui-info ref="${REF_INFO}"/>
    <ui-upload ref="${REF_UPLOAD}"/>
    <div class="row q-gutter-xs  justify-center items-center">
        <div style="width: 200px;">
            <q-input v-model="title"
                     :loading="ifLoading"
                     autofocus
                     clearable
                     dense
                     outlined
                     placeholder="Enter image title to search..."
                     v-on:keyup.enter="onSearch"
            />
        </div>
        <div>
            <q-btn label="OK" color="${DEF.COLOR_Q_PRIMARY}" v-on:click="onSearch"/>
        </div>
        <div>
            <q-btn label="Upload" color="${DEF.COLOR_Q_PRIMARY}" v-on:click="onUpload"/>
        </div>
    </div>
    <div class="text-center">
        {{info}}
    </div>
    <div class="hGallery">
        <div class="gallery flex justify-center q-gutter-md">
            <template v-for="one of items">
                <ui-item :item="one" @onClick="doClick"/>
            </template>
        </div>
    </div>
</div>
<div class="footer">
    <a href="https://wiredgeese.com/" target="_blank">developed by Wiredgeese Devs</a>
</div>
`;

    // FUNCS


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
        components: {uiInfo, uiItem, uiDisplay, uiUpload},
        data() {
            return {
                ifLoading: false,
                info: null,
                items: [],
                title: null,
            };
        },
        methods: {
            doClick(item) {
                /** @type {App_Front_Ui_Route_Home_A_Display.IUi} */
                const ui = this.$refs[REF_DISPLAY];
                ui.show(item);
            },
            async onSearch() {
                this.ifLoading = true;
                const rs = await modImg.list(this.title);
                if (rs) {
                    this.items = rs;

                } else {
                    this.items = [];
                }
                this.info = `Total ${this.items.length} items are found.`;
                this.ifLoading = false;
            },
            async onUpload() {
                /** @type {App_Front_Ui_Route_Home_A_Upload.IUi} */
                const ui = this.$refs[REF_UPLOAD];
                ui.show();
            },
        },
        mounted() {
            // store UI component into widget
            wgInfo.set(this.$refs[REF_INFO]);

        },
    };
}

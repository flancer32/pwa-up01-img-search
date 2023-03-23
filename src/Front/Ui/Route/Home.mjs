/**
 * Screen for application's homepage.
 *
 * @namespace App_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Route_Home';
const ID_TITLE = 'title';
const ID_UPLOAD = 'upload';

// MODULE'S FUNCTIONS

/**
 * Load selected file as base64 encoded string (data:image/png;base64,...).
 * @returns {Promise<string>}
 */
function bufferFile() {
    return new Promise((resolve, reject) => {
        const el = document.getElementById(ID_UPLOAD);
        const file = el.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (evt) => resolve(evt.target.result);
        reader.onerror = reject;
    });
}

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
    /** @type {App_Front_Ui_Route_Home_A_ListItem.vueCompTmpl} */
    const uiItem = spec['App_Front_Ui_Route_Home_A_ListItem$'];

    // VARS
    const template = `
<div style="display: flex; flex-direction: column; gap: 10px;">
   <div style="display: flex; flex-direction: row; gap: 10px;">
       <input id="${ID_TITLE}" v-model="title" placeholder="Enter image title to search...">
       <button class="btn large" v-on:click="onClick">Search</button>
    </div>
    <input id="${ID_UPLOAD}" type="file" v-on:change="onSelectFileChanged">
    <button v-on:click="onUpload">Upload Image</button>
    <button v-on:click="onListAll">List All Uploads</button>
    <div class="gallery">
        <template v-for="one of items">
            <ui-item :item="one" />
        </template>
    </div>
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
        components: {uiItem},
        data() {
            return {
                bufUpload: null, // 'data:image/png;base64,...' (TODO: remove buffer)
                title: null,
                items: [],
            };
        },
        methods: {
            onClick() {
                console.log(`done.`);
            },
            async onListAll() {
                const res = await modImg.list();
                this.items = res;
                console.dir(res);
            },
            async onUpload() {
                const buffer = await bufferFile();
                /** @type {App_Shared_Dto_Image.Dto} */
                const res = await modImg.create(this.title, buffer);
                if (res?.bid) {
                    console.dir(res);
                }
            },
            /**
             * Load base64 decoded content of the selected file into memory buffer.
             * @param {ProgressEvent} e
             */
            onSelectFileChanged(e) {
                // const wg = this;
                // const file = e.target.files[0];
                // const reader = new FileReader();
                // reader.readAsDataURL(file);
                // reader.onload = function (e) {
                //     debugger;
                //     wg.bufUpload = e.target.result;
                // }
            },
        },
        created() {

        },
    };
}

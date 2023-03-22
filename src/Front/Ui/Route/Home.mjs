/**
 * Screen for application's homepage.
 *
 * @namespace App_Front_Ui_Route_Home
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Route_Home';
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

    // VARS
    const template = `
<div style="display: flex; flex-direction: column; gap: 10px;">
   <div style="display: flex; flex-direction: row; gap: 10px;">
       <input v-model="text" placeholder="Enter image title to search...">
       <button class="btn large" v-on:click="onClick">Search</button>
    </div>
    <input id="${ID_UPLOAD}" type="file" v-on:change="onSelectFileChanged">
    <button class="btn large" v-on:click="onUpload">Upload Image</button>
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
        components: {},
        data() {
            return {
                bufUpload: null, // 'data:image/png;base64,...'
                text: null,
            };
        },
        methods: {
            onClick() {
                console.log(`done.`);
            },
            async onUpload() {
                const buffer = await bufferFile();
                const res = await modImg.create('title', buffer);
                debugger
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

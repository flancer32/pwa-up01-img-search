/**
 * UI component for dialog to upload new image to the back.
 *
 * @namespace App_Front_Ui_Route_Home_A_Upload
 */
// MODULE'S VARS
const NS = 'App_Front_Ui_Route_Home_A_Upload';
const ID_UPLOAD = 'uploadFile';
const NAME_TITLE = 'uploadTitle';
const REF_SELF = 'self';

// MODULE'S INTERFACES
// noinspection JSUnusedLocalSymbols
/**
 * @interface
 * @memberOf App_Front_Ui_Route_Home_A_Upload
 */
class IUi {
    show() { }
}

// MODULE'S FUNCTIONS
/**
 * TeqFW DI factory function to get dependencies for the object.
 *
 * @returns {App_Front_Ui_Route_Home_A_Upload.vueCompTmpl}
 */
export default function (spec) {
    /** @type {App_Front_Defaults} */
    const DEF = spec['App_Front_Defaults$'];
    /** @type {App_Front_Mod_Image} */
    const modImg = spec['App_Front_Mod_Image$'];
    /** @type {TeqFw_Ui_Quasar_Front_Lib_Spinner.vueCompTmpl} */
    const uiSpinner = spec['TeqFw_Ui_Quasar_Front_Lib_Spinner$'];
    /** @type {App_Front_Widget_Info} */
    const wgInfo = spec['App_Front_Widget_Info$'];

    // VARS
    const template = `
<q-dialog ref="${REF_SELF}">
    <q-card class="img-upload">
        <ui-spinner :loading="ifLoading"/>
        <q-card-section class="header">
            <div class="">Upload New Image</div>
            <div class="cursor-pointer">
                <div v-if="!ifSelected">
                    <q-icon name="add_circle" size="sm" v-on:click="onFileSelect">
                </div>
                <div v-if="ifSelected">
                    <q-icon name="delete" size="sm" v-on:click="onFileUnselect">
                </div>
            </div>
        </q-card-section>
        <q-card-section class="">
            <input id="${ID_UPLOAD}" type="file" tabindex="-1" hidden v-on:change="onSelectFileChanged">
            <!-- image -->
            <div class="text-center">
                <img :src="uiImgSrc"
                     alt="Uploaded Image"
                >
            </div>
            <!-- title -->
            <div>
                <q-input v-model="title"
                         autofocus
                         name="${NAME_TITLE}"
                         dense
                         outlined
                         placeholder="Enter title for the image..."
                         v-on:keyup.enter="onUpload"
                />
            </div>
        </q-card-section>

        <q-card-actions align="center">
            <q-btn label="Upload" color="${DEF.COLOR_Q_PRIMARY}" :disable="!ifCanUpload" v-on:click="onUpload"/>
        </q-card-actions>

    </q-card>

</q-dialog>
`;

    // MAIN
    /**
     * Template to create new component instances using Vue.
     *
     * @const {Object} vueCompTmpl
     * @memberOf App_Front_Ui_Route_Home_A_Upload
     */
    return {
        teq: {package: DEF.SHARED.NAME},
        name: NS,
        template,
        components: {uiSpinner},
        data() {
            return {
                bufferB64: null, // 'data:image/png;base64,...'
                ifLoading: false,
                title: null,
            };
        },
        computed: {
            ifCanUpload() {
                return Boolean(this.title) && this.ifSelected;
            },
            ifSelected() {
                return Boolean(this.bufferB64);
            },
            uiImgSrc() {
                if (this.bufferB64) return this.bufferB64;
                else return './img/placeholder.png';
            },
        },
        /**
         * @mixes App_Front_Ui_Route_Home_A_Upload.IUi
         */
        methods: {
            formReset() {
                this.bufferB64 = null;
                this.ifLoading = false;
                this.title = null;
            },
            hide() {
                this.formReset();
                // switch off Quasar dialog
                this.$refs[REF_SELF].hide();
            },
            onFileSelect() {
                const elUpload = document.getElementById(ID_UPLOAD);
                elUpload?.click();
            },
            onFileUnselect() {
                this.bufferB64 = null;
            },
            /**
             * @param {Event} evt
             */
            onSelectFileChanged(evt) {
                const file = evt.target.files[0];
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (evt) => {
                    this.bufferB64 = evt.target.result;
                    const elTitle = document.querySelector(`input[name="${NAME_TITLE}"]`);
                    elTitle.focus();
                }
            },
            async onUpload() {
                // FUNCS
                function getCoordinates() {
                    return new Promise((resolve) => {
                        let res = {lat: null, long: null};
                        const options = {
                            enableHighAccuracy: true,
                            timeout: 5000,
                            maximumAge: 300000
                        };

                        function error() {
                            // stealth error message
                            resolve(res);
                        }

                        function success(pos) {
                            res.lat = pos?.coords?.latitude;
                            res.long = pos?.coords?.longitude;
                            resolve(res);
                        }

                        navigator.geolocation.getCurrentPosition(success, error, options);
                    });
                }

                // MAIN
                this.ifLoading = true;
                const geo = await getCoordinates();
                /** @type {App_Shared_Dto_Image.Dto} */
                const res = await modImg.create(this.title, this.bufferB64, geo.lat, geo.long);
                if (res?.bid) {
                    wgInfo.get().show(`New image is uploaded (#${res.bid}).`);
                    this.hide();
                } else {
                    wgInfo.get().show(`Cannot upload new image.`);
                }
                this.ifLoading = false;
            },
            async show() {
                this.formReset();
                // fire up Quasar dial
                this.$refs[REF_SELF].show();
            },
        },
    };
}

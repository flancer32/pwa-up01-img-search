/**
 * Info message widget (application level wrapper for UI component).
 * @namespace App_Front_Widget_Info
 */
export default class App_Front_Widget_Info {
    constructor() {
        // VARS
        /** @type {App_Front_Ui_Lib_Info.IUi} */
        let _store;

        // INSTANCE METHODS
        /**
         * Get UI component stored in the widget.
         * @returns {App_Front_Ui_Lib_Info.IUi}
         */
        this.get = () => _store;
        /**
         * Init widget with UI component.
         * @param {App_Front_Ui_Lib_Info.IUi} data
         */
        this.set = (data) => _store = data;
    }
}

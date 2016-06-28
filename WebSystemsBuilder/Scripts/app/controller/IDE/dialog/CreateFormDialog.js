Ext.define('WebSystemsBuilder.controller.IDE.dialog.CreateFormDialog', {
    extend: 'Ext.app.Controller',
    views: [
        'WebSystemsBuilder.view.IDE.dialog.CreateFormDialog'
    ],
    //stores: [
    //    'WebSystemsBuilder.store.IDE.query.QueryFrom'
    //],
    //models: [
    //    'WebSystemsBuilder.model.IDE.query.QueryFrom'
    //],

    init: function () {
        this.control({
            'CreateFormDialog': {
                afterrender: this.onLoad
            },
            'CreateFormDialog button[action=onCreate]': {
                click: this.onCreateForm
            },
            'CreateFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load form (afterrender)
     * @param current window (CreateFormDialog)
     */
    onLoad: function (win) {
        //var dictionary = win.down('combobox[name=dictionary]');
        //win.body.mask('Загрузка...');
        //dictionary.getStore().load({
        //    callback:function(){
        //        win.body.unmask();
        //    }
        //});
    },

    /**
     * Create new form ("Create" button click)
     * @param "Create" button
     */
    onCreateForm: function (btn) {
        var win = btn.up('CreateFormDialog');
        var formName = win.down('textfield[name=formName]');
        var description = win.down('textareafield[name=description]');

        if (!formName.getValue()) {
            var error = 'Type form name';
            WebSystemsBuilder.utils.MessageBox.error(error);
        }
        if (!description.getValue()) {
            var error = 'Type form description';
            WebSystemsBuilder.utils.MessageBox.error(error);
        }
        
        // Fire event to main IDE form
        win.fireEvent('FormIsReadyToCreate', formName.getValue(), description.getValue());
        win.close();
    },

    /**
     * Close form ("Close" button click)
     * @param "Close" button
     */
    onClose: function (btn) {
        btn.up('CreateFormDialog').close();
    }

});
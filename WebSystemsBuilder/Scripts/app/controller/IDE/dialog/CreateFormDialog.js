Ext.define('WebSystemsBuilder.controller.IDE.dialog.CreateFormDialog', {
    extend: 'Ext.app.Controller',
    views: [
        'WebSystemsBuilder.view.IDE.dialog.CreateFormDialog'
    ],

    init: function () {
        this.control({
            'CreateFormDialog button[action=onCreate]': {
                click: this.onCreateForm
            },
            'CreateFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Create new form ("Create" button click)
     * @param btn "Create" button
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
     * @param btn "Close" button
     */
    onClose: function (btn) {
        btn.up('CreateFormDialog').close();
    }

});
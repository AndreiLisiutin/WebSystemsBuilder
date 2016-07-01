Ext.define('WebSystemsBuilder.controller.IDE.dialog.OpenFormDialog', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.dialog.OpenFormDialog'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.dialog.OpenFormDialog'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.dialog.OpenFormDialog'
    ],

    init: function () {
        this.control({
            'OpenFormDialog': {
                afterrender: this.onLoad
            },
            'OpenFormDialog combobox[name=form]': {
                select: this.onFormChange
            },
            'OpenFormDialog button[action=onOpen]': {
                click: this.onOpenForm
            },
            'OpenFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load form (afterrender)
     * @param win Current window (CreateFormDialog)
     */
    onLoad: function (win) {
        var form = win.down('combobox[name=form]');
        var description = win.down('textareafield[name=description]');

        form.getEl().mask('Loading...');
        form.getStore().load({
            callback: function () {
                form.getEl().unmask();
            }
        });
    },

    /**
     * Open form ("Open" button click)
     * @param btn "Open" button
     */
    onOpenForm: function (btn) {
        var win = btn.up('window');
        var form = win.down('combobox[name=form]');
        var description = win.down('textareafield[name=description]');

        var formID = form.getValue();
        if (!formID) {
            var error = 'Choose the form.';
            MessageBox.error(error);
        }

        win.fireEvent('FormIsReadyToOpen', formID);
        win.close();
    },

    /**
     * Load description of chosen form
     * @param combo Combo "Form"
     * @param record Selected record of "Form" combo
     */
    onFormChange: function (combo, record) {
        var win = combo.up('window');
        var form = win.down('combobox[name=form]');
        var description = win.down('textareafield[name=description]');

        if (!form.getValue()) {
            description.setValue(null);
        }

        description.setValue(record.get('Description'));
    },

    /**
     * Close form ("Close" button click)
     * @param btn "Close" button
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});
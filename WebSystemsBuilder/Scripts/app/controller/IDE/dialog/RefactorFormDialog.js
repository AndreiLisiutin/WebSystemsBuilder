Ext.define('WebSystemsBuilder.controller.IDE.dialog.RefactorFormDialog', {
    extend: 'Ext.app.Controller',
    views: [
        'WebSystemsBuilder.view.IDE.dialog.RefactorFormDialog'
    ],

    init: function () {
        this.control({
            'RefactorFormDialog': {
                afterrender: this.onLoad
            },
            'RefactorFormDialog button[action=onRefactor]': {
                click: this.onRefactor
            },
            'RefactorFormDialog button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load form (afterrender)
     */
    onLoad: function (win) {
        var formName = win.down('textfield[name=formName]');
        var description = win.down('textareafield[name=description]');

        formName.setValue(win.formName);
        description.setValue(win.formDescription);
    },

    /**
     * Функция открытия выбранной формы
     * @param btn Button "Refactor"
     */
    onRefactor: function (btn) {
        var win = btn.up('window');
        var formName = win.down('textfield[name=formName]');
        var description = win.down('textareafield[name=description]');

        if (!formName.getValue()) {
            WebSystemsBuilder.utils.MessageBox.error('Type form name.');
        }
        if (!description.getValue()) {
            WebSystemsBuilder.utils.MessageBox.error('Type form description.');
        }



        // если форма сохранена, поменять ее имя
        if (win.formID) {
            win.body.mask('Refactor...');
            Ext.Ajax.request({
                url: 'MainIDE/RefactorForm',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                params: {
                    formID: win.formID + '',
                    Name: formName.getValue(),
                    Description: description.getValue()
                },
                success: function (objServerResponse) {
                    win.body.unmask();
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    if (jsonResp.Code == 0) {
                        // Event about refactor success
                        win.fireEvent('FormIsReadyToRename', formName.getValue(), description.getValue());
                        win.close();

                    } else {
                        WebSystemsBuilder.utils.MessageBox.error(jsonResp.Message);
                    }
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
                }
            });
        } else {
            // Form was not saved yet, just event to main IDE form
            win.fireEvent('FormIsReadyToRename', formName.getValue(), description.getValue());
            win.close();
        }
    },

    /**
     * Close current window
     * @param btn button "Close"
     */
    onClose: function (btn) {
        btn.up('RefactorFormDialog').close();
    }

});
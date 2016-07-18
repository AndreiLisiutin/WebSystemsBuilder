Ext.define('WebSystemsBuilder.controller.main.FormList', {
    extend: 'Ext.app.Controller',
    views: [
        'WebSystemsBuilder.view.main.FormList'
    ],
    models: [
        'WebSystemsBuilder.model.main.FormList'
    ],
    stores: [
        'WebSystemsBuilder.store.main.FormList'
    ],

    init: function () {
        this.control({
            'FormList': {
                afterrender: this.onLoad
            },
            'FormList button[action=onEditForm]': {
                click: this.onEditForm
            },
            'FormList button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    onLoad: function (win) {
        var FormListGrid = win.down('gridpanel[name=FormListGrid]');
        FormListGrid.getStore().load();
    },

    onEditForm: function (btn) {
        var win = btn.up('window');
        var FormListGrid = win.down('gridpanel[name=FormListGrid]');
        var selectedForm = FormListGrid.getSelectionModel().getSelection()[0];

        if (!selectedForm) {
            MessageBox.error('Choose the form');
            return;
        }

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.MainIDE');
        var formWin = WebSystemsBuilder.utils.Windows.open('MainIDE', {
            formID: selectedForm.get('FormID')
        });
        formWin.on('FormSaved', function() {
            FormListGrid.getStore().load();
        });
    },

    onClose: function (btn) {
        btn.up('window').close();
    }
});

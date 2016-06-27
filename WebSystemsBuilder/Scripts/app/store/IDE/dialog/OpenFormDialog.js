Ext.define('WebSystemsBuilder.store.editor.dialog.OpenFormDialog', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.editor.dialog.Form', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.dialog.Form',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'Form/GetFormsList'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});
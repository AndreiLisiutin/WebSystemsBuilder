Ext.define('WebSystemsBuilder.store.IDE.dialog.OpenFormDialog', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.IDE.dialog.Form', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.dialog.Form',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'Form/GetFormsList'
        },

        reader: {
            type: 'json',
            root: 'Data',
            successProperty: 'Code'
        }
    }
});
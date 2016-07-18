Ext.define('WebSystemsBuilder.store.IDE.event.OpenFormAction', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.IDE.event.FormParameters', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.FormParameters',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'Form/GetFormParametersList'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});
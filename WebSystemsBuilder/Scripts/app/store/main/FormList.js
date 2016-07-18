Ext.define('WebSystemsBuilder.store.main.FormList', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.main.FormList',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'Form/GetFormList'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});
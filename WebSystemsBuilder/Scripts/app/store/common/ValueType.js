Ext.define('WebSystemsBuilder.store.common.ValueType', {
    extend:'Ext.data.Store',
    required: ['WebSystemsBuilder.model.common.ValueType'],
    model: 'WebSystemsBuilder.model.common.ValueType',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'ValueTypes/GetValueTypes'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});
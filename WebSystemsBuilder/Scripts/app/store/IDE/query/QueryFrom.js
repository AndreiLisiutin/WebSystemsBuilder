Ext.define('WebSystemsBuilder.store.IDE.query.QueryFrom', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.IDE.query.AllDictionary', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.Dictionary',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.IDE.query.Dictionary', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.Dictionary',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetAllDictionaries'
        },

        reader: {
            type: 'json',
            root: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.query.Field', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.Field',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetDictionaryFields'
        },

        reader: {
            type: 'json',
            root: 'Data',
            successProperty: 'Code'
        }
    }
});
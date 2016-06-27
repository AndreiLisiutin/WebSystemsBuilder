Ext.define('WebSystemsBuilder.store.editor.query.QueryFrom', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.editor.query.AllDictionary', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.query.Dictionary',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.editor.query.Dictionary', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.query.Dictionary',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetAllDictionaries'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});

Ext.define('WebSystemsBuilder.store.editor.query.Field', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.query.Field',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetDictionaryFields'
        },

        reader: {
            type: 'json',
            root: 'resultData',
            successProperty: 'resultCode'
        }
    }
});
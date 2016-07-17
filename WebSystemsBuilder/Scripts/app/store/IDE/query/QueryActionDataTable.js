Ext.define('WebSystemsBuilder.store.IDE.query.QueryActionDataTable', {
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
            read: 'MainIDE/GetTableList'
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
            read: 'MainIDE/GetTableColumnList'
        },

        reader: {
            type: 'json',
            root: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.query.JoinKind', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.JoinKind',
    autoLoad: false,
    data:[
        { JoinKindID: 1, Name: 'INNER' },
        { JoinKindID: 2, Name: 'LEFT' }
    ]
});
Ext.define('WebSystemsBuilder.store.IDE.query.QueryAction', {
    extend: 'Ext.data.Store',
    requires: ['WebSystemsBuilder.model.IDE.query.QueryAction'],
    fields: []
});

// Data table store
Ext.define('WebSystemsBuilder.store.IDE.query.DataTable', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.DataTable',
    autoLoad: false,
    data: []
});

// Column store
Ext.define('WebSystemsBuilder.store.IDE.query.Column', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.Column',
    autoLoad: false,
    data: []
});

// Join and query condition
Ext.define('WebSystemsBuilder.store.IDE.query.Condition', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.Condition',
    autoLoad: false,
    data: []
});

// Join and query condition
Ext.define('WebSystemsBuilder.store.IDE.query.QueryInParameters', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.QueryInParameters',
    autoLoad: false,
    data: []
});

// Data table store
Ext.define('WebSystemsBuilder.store.IDE.query.InsertColumnList', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.InsertColumnList',
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
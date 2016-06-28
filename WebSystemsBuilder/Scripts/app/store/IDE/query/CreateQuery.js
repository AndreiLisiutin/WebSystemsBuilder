Ext.define('WebSystemsBuilder.store.IDE.query.CreateQuery', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.IDE.query.From', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.From',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.IDE.query.Select', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.Select',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.IDE.query.Where', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.query.Where',
    autoLoad: false,
    data:[]
});
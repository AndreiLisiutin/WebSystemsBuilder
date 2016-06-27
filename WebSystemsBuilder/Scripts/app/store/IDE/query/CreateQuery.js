Ext.define('WebSystemsBuilder.store.editor.query.CreateQuery', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.editor.query.From', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.query.From',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.editor.query.Select', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.query.Select',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.editor.query.Where', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.query.Where',
    autoLoad: false,
    data:[]
});
Ext.define('WebSystemsBuilder.store.IDE.event.EventHandler', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.IDE.event.Action', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.Action',
    autoLoad: false,
    data:[]
});
Ext.define('WebSystemsBuilder.store.IDE.event.EventAction', {
    extend:'Ext.data.Store',
    fields:[]
});

// Список действий события
Ext.define('WebSystemsBuilder.store.IDE.event.Action', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.Action',
    autoLoad: false,
    data:[]
});
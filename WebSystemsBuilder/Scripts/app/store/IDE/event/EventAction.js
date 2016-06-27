Ext.define('WebSystemsBuilder.store.editor.event.EventAction', {
    extend:'Ext.data.Store',
    fields:[]
});

// Список действий события
Ext.define('WebSystemsBuilder.store.editor.event.Action', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.event.Action',
    autoLoad: false,
    data:[]
});
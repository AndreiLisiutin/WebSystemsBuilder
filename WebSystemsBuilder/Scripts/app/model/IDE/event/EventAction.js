Ext.define('WebSystemsBuilder.model.editor.event.EventAction', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.editor.event.Action', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'orderNumber',
        'eventID',
        'actionTypeID',
        'parameters'
    ]
});

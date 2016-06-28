Ext.define('WebSystemsBuilder.model.IDE.event.EventAction', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.event.Action', {
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

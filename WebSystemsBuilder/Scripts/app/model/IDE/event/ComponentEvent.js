Ext.define('WebSystemsBuilder.model.IDE.event.ComponentEvent', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'controlTypeID',
        'eventTypeID',
        'hasHandler',
        'actions',
        'controlID',
        'controlName'
    ]
});
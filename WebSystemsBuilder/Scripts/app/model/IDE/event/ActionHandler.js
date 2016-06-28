Ext.define('WebSystemsBuilder.model.IDE.event.ActionHandler', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.event.Handler', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'actionKindID'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.event.HandlerParams', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'actionTypeID',
        'domainValueTypeID',
        'controlName'
    ]
});

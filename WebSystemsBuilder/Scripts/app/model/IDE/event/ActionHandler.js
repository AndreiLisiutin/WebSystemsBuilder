﻿Ext.define('WebSystemsBuilder.model.editor.event.ActionHandler', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.editor.event.Handler', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'actionKindID'
    ]
});

Ext.define('WebSystemsBuilder.model.editor.event.HandlerParams', {
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

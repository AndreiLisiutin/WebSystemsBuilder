Ext.define('WebSystemsBuilder.model.IDE.event.EventHandler', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.event.Action', {
    extend: 'Ext.data.Model',
    fields: [
        'UniqueID',
        'ActionTypeID',
        'EventActionType',
        'ChildActions',
        'ClientAction',
        'OpenFormAction',
        'QueryType',
        'PredicateAction'
    ]
});

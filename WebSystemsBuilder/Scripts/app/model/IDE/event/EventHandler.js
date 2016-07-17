Ext.define('WebSystemsBuilder.model.IDE.event.EventHandler', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.event.Action', {
    extend: 'Ext.data.Model',
    fields: [
        'UniqueID',
        'EventActionTypeID',
        'EventActionType',
        'ChildActions',
        // ClientAction
        'Control',
        'ActionType',
        // OpenFormAction
        'Form',
        'FormParameters',
        // QueryAction
        'QueryType',
        'QueryTypeColumnList',
        'QueryTypeTableList',
        'QueryTypeInList',
        'QueryTypeOutList',
        // PredicateAction
        'TrueActionUniqueID',
        'FalseActionUniqueID',
        'TrueAction',
        'FalseAction'
    ]
});

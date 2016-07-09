Ext.define('WebSystemsBuilder.model.IDE.query.QueryFrom', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.query.Dictionary', {
    extend: 'Ext.data.Model',
    fields: [
        'TableID',
        'Name',
        'PhysicalTable'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.Field', {
    extend: 'Ext.data.Model',
    fields: [
        'ColumnID',
        'Name',
        'PhysicalColumn',
        'ValueTypeID',
        'TableID'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.JoinKind', {
    extend: 'Ext.data.Model',
    fields: [
        'JoinKindID',
        'Name'
    ]
});
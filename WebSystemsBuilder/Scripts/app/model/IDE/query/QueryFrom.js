Ext.define('WebSystemsBuilder.model.IDE.query.QueryFrom', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.query.Dictionary', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'tableName'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.Field', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'columnName',
        'domainValueTypeID',
        'dictionaryID'
    ]
});
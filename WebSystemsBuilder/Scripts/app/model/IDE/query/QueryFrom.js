Ext.define('WebSystemsBuilder.model.editor.query.QueryFrom', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.editor.query.Dictionary', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'tableName'
    ]
});

Ext.define('WebSystemsBuilder.model.editor.query.Field', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'columnName',
        'domainValueTypeID',
        'dictionaryID'
    ]
});
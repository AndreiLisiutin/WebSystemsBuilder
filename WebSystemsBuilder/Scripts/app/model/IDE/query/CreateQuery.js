Ext.define('WebSystemsBuilder.model.IDE.query.CreateQuery', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.query.From', {
    extend: 'Ext.data.Model',
    fields: [
        'Table',
        'JoinTable',
        'JoinKind',
        {
            name: 'JoinKindName',
            convert: function (v, record) {
                var joinKind = record.get('JoinKind');
                if (!joinKind) return null;
                return joinKind.Name;
            }
        },
        'Condition',
        'TableID',
        'Name'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.Select', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'dictionary',
        'field',
        'domainValueTypeID',
        'columnName',
        'obj'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.Where', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'operation',
        'condition',
        'domainValueTypeID',
        'obj'
    ]
});
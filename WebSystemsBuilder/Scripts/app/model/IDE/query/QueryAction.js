Ext.define('WebSystemsBuilder.model.IDE.query.QueryAction', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.query.DataTable', {
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

Ext.define('WebSystemsBuilder.model.IDE.query.Column', {
    extend: 'Ext.data.Model',
    fields: [
        'ColumnID',
        'Name',
        'TableID',
        'domainValueTypeID',
        'obj'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.Condition', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'operation',
        'condition',
        'domainValueTypeID',
        'obj'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.QueryInParameters', {
    extend: 'Ext.data.Model',
    fields: [
        'UniqueID',
        'Name'
    ]
});
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
        'Table',
        'Control',
        'Column',
        {
            name: 'ColumnID',
            convert: function (v, record) {
                var column = record.get('Column');
                if (!column) return null;
                return column.ColumnID;
            }
        },
        {
            name: 'ColumnName',
            convert: function (v, record) {
                var column = record.get('Column');
                if (!column) return null;
                return column.Name;
            }
        },
        {
            name: 'TableID',
            convert: function (v, record) {
                var table = record.get('Table');
                if (!table) return null;
                return table.TableID;
            }
        },
        {
            name: 'TableName',
            convert: function (v, record) {
                var table = record.get('Table');
                if (!table) return null;
                return table.Name;
            }
        }
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.Condition', {
    extend: 'Ext.data.Model',
    fields: [
        'UniqueID',
        'FirstPart',
        'SecondPart',
        'ConditionSign',
        'ConditionString',
        'Operation'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.QueryInParameters', {
    extend: 'Ext.data.Model',
    fields: [
        'UniqueID',
        'Name',
        'QueryParameterTypeID',
        'QueryParameterType'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.query.InsertColumnList', {
    extend: 'Ext.data.Model',
    fields: [
        'ColumnID',
        'Name',
        'PhysicalColumn',
        {
            name: 'PlaceHolder',
            convert: function (v, record) {
                var column = record.get('PhysicalColumn');
                if (!column) return null;
                return '{' + column + '}';
            }
        },
        'ValueTypeID',
        'OperandValue'
    ]
});
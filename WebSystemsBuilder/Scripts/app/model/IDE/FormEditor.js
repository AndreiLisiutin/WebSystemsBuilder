Ext.define('WebSystemsBuilder.model.editor.FormEditor', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.editor.Components', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'group',
        'component',
        'icon',
        'description',
        'path',
        'properties',
        'queryParams',
        'childComponents',
        'data',     // данные
        'events'    // события
    ]
});

Ext.define('WebSystemsBuilder.model.editor.Groups', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'type'
    ]
});

Ext.define('WebSystemsBuilder.model.editor.Query', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'sqlText'
    ]
});

Ext.define('WebSystemsBuilder.model.editor.QueryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'queryTypeID',
        'domainValueTypeID'
    ]
});

Ext.define('WebSystemsBuilder.model.editor.DictionaryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name'
    ]
});

Ext.define('WebSystemsBuilder.model.editor.Params', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'queryTypeID',
        'domainValueTypeID',
        'value',
        'rawValue'
    ]
});
Ext.define('WebSystemsBuilder.model.editor.dialog.FormParameters', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.editor.dialog.FormParametersIn', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'controlName'
    ]
});

Ext.define('WebSystemsBuilder.model.editor.dialog.FormParametersOut', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'controlName'
    ]
});
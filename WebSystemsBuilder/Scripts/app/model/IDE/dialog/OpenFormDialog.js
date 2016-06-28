Ext.define('WebSystemsBuilder.model.IDE.dialog.OpenFormDialog', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.dialog.Form', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'dictionaryID',
        'dictionary'
    ]
});
﻿Ext.define('WebSystemsBuilder.model.editor.dialog.OpenFormDialog', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.editor.dialog.Form', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'dictionaryID',
        'dictionary'
    ]
});
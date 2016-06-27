﻿Ext.define('WebSystemsBuilder.model.IDE.dialog.FormParameters', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.dialog.FormParametersIn', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'controlName'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.dialog.FormParametersOut', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'controlName'
    ]
});
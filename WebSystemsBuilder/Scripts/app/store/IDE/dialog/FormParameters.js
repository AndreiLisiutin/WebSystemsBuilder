Ext.define('WebSystemsBuilder.store.IDE.dialog.FormParameters', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.IDE.dialog.FormParametersIn', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.dialog.FormParametersIn',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.IDE.dialog.FormParametersOut', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.dialog.FormParametersOut',
    autoLoad: false,
    data:[]
});
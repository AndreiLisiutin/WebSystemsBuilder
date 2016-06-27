Ext.define('WebSystemsBuilder.store.editor.dialog.FormParameters', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.editor.dialog.FormParametersIn', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.dialog.FormParametersIn',
    autoLoad: false,
    data:[]
});

Ext.define('WebSystemsBuilder.store.editor.dialog.FormParametersOut', {
    extend:'Ext.data.Store',
    model:'WebSystemsBuilder.model.editor.dialog.FormParametersOut',
    autoLoad: false,
    data:[]
});
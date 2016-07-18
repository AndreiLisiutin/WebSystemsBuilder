Ext.define('WebSystemsBuilder.store.IDE.event.ActionHandler', {
    extend:'Ext.data.Store',
    fields:[]
});

Ext.define('WebSystemsBuilder.store.IDE.event.Handler', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.Handler',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'EventEditor/GetHandlerTypeList'
        },

        reader: {
            type: 'json',
            root: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.event.HandlerParams', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.HandlerParams',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'EventEditor/GetParamTypeList'
        },

        reader: {
            type: 'json',
            root: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.event.Control', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.Control',
    autoLoad: false,
    data: []
});

Ext.define('WebSystemsBuilder.store.IDE.event.FormParameter', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.FormParameter',
    autoLoad: false,
    data: []
});

Ext.define('WebSystemsBuilder.store.IDE.event.ClientActionType', {
    extend:'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.event.ClientActionType',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'EventType/GetClientActionTypeList'
        },

        reader: {
            type: 'json',
            root: 'Data',
            successProperty: 'Code'
        }
    }
});
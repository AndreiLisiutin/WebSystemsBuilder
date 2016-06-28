Ext.define('WebSystemsBuilder.store.IDE.MainIDE', {
    extend: 'Ext.data.Store',
    fields: []
});

Ext.define('WebSystemsBuilder.store.IDE.ControlTypeGroup', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.ControlTypeGroup',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'MainIDE/GetControlTypeGroupList'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.ControlType', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.ControlType',
    groupField: 'Group',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'MainIDE/GetControlTypeList'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.ProjectInspector', {
    extend: 'Ext.data.TreeStore',
    autoLoad: false,
    root: {
        expanded: true,
        name: 'root',
        id: 'root',
        text: 'View',
        icon: 'Scripts/resources/icons/editor/w.png',
        children: []
    }
});

Ext.define('WebSystemsBuilder.store.IDE.Query', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.Query',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetQueryTypeList'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.QueryField', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.QueryField',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetQueryOutParamsList'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.DictionaryField', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.DictionaryField',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetDictionaryFields'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});

Ext.define('WebSystemsBuilder.store.IDE.Params', {
    extend: 'Ext.data.Store',
    model: 'WebSystemsBuilder.model.IDE.Params',
    autoLoad: false,

    proxy: {
        type: 'ajax',

        api: {
            read: 'QueryEditor/GetQueryInParamsList'
        },

        reader: {
            type: 'json',
            rootProperty: 'Data',
            successProperty: 'Code'
        }
    }
});
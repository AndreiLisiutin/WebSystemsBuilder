Ext.define('WebSystemsBuilder.model.IDE.event.ActionHandler', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.event.Handler', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'actionKindID'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.event.HandlerParams', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'value',
        'actionTypeID',
        'domainValueTypeID',
        'controlName'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.event.Control', {
    extend: 'Ext.data.Model',
    fields: [
        'componentInfo' ,
        {
            name: 'Name',
            convert: function (v, record) {
                var componentInfo = record.get('componentInfo');
                if (!componentInfo) return null;
                return componentInfo.Name + '[id=' + componentInfo.uniqueID + ']';
            }
        },
        {
            name: 'UniqueID',
            convert: function (v, record) {
                var componentInfo = record.get('componentInfo');
                if (!componentInfo) return null;
                return componentInfo.uniqueID;
            }
        }
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.event.FormParameter', {
    extend: 'Ext.data.Model',
    fields: [
        'formParameter' ,
        {
            name: 'Name',
            convert: function (v, record) {
                var formParameter = record.get('formParameter');
                if (!formParameter) return null;
                return formParameter.FormParameter.Name;
            }
        },
        {
            name: 'UniqueID',
            convert: function (v, record) {
                var formParameter = record.get('formParameter');
                if (!formParameter) return null;
                return formParameter.FormParameter.UniqueID;
            }
        },
        'Value'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.event.ClientActionType', {
    extend: 'Ext.data.Model',
    fields: [
        'ClientActionTypeID',
        'Name'
    ]
});

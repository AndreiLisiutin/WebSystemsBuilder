﻿Ext.define('WebSystemsBuilder.model.IDE.MainIDE', {
    extend: 'Ext.data.Model',
    fields: []
});

Ext.define('WebSystemsBuilder.model.IDE.ControlTypeGroup', {
    extend: 'Ext.data.Model',
    fields: [
        'ControlTypeGroupID',
        'Name'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.ControlType', {
    extend: 'Ext.data.Model',
    fields: [
        'ControlType',
        'ControlTypeGroup',
        'Properties',
        'PropertiesList',
        'EventTypesList',
        {
            name: 'ControlTypeGroupID',
            convert: function (v, record) {
                var controlType = record.get('ControlType');
                if (!controlType) return null;
                return controlType.ControlTypeGroupID;
            }
        },
        {
            name: 'ControlTypeID',
            convert: function (v, record) {
                var controlType = record.get('ControlType');
                if (!controlType) return null;
                return controlType.ControlTypeID;
            }
        },
        {
            name: 'Group',
            type: 'string',
            convert: function(v, record ) {
                var controlTypeGroup = record.get('ControlTypeGroup');
                return controlTypeGroup ? controlTypeGroup.Name : null;
            }
        },
        {
            name: 'Name',
            convert: function (v, record) {
                var controlType = record.get('ControlType');
                if (!controlType) return null;
                return controlType.Name;
            }
        },
        {
            name: 'Description',
            convert: function (v, record) {
                var controlType = record.get('ControlType');
                if (!controlType) return null;
                return controlType.Description;
            }
        },
        {
            name: 'ExtJsClass',
            convert: function (v, record) {
                var controlType = record.get('ControlType');
                if (!controlType) return null;
                return controlType.ExtJsClass;
            }
        },
        {
            name: 'Icon',
            type: 'string',
            convert: function (v, record) {
                var controlType = record.get('ControlType');
                if (!controlType) return null;

                var name = controlType.Name.toLowerCase();
                var path = "Scripts/resources/icons/IDE/";
                var png = ".png";
                if (name.startsWith("container")) {
                    return path + "container" + png;
                } else {
                    return path + name + png;
                }
            }
        }
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.Query', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'sqlText'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.QueryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name',
        'queryTypeID',
        'domainValueTypeID'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.DictionaryField', {
    extend: 'Ext.data.Model',
    fields: [
        'ID',
        'name'
    ]
});

Ext.define('WebSystemsBuilder.model.IDE.Params', {
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

Ext.define('WebSystemsBuilder.model.IDE.FormParameters', {
    extend: 'Ext.data.Model',
    fields: [
        'FormParameter',
        'PropertyValueType',
        {
            name: 'UniqueID',
            convert: function (v, record) {
                var FormParameter = record.get('FormParameter');
                if (!FormParameter) return null;
                return FormParameter.UniqueID;
            }
        },
        {
            name: 'Name',
            convert: function (v, record) {
                var FormParameter = record.get('FormParameter');
                if (!FormParameter) return null;
                return FormParameter.Name;
            }
        },
        {
            name: 'ValueTypeID',
            convert: function (v, record) {
                var FormParameter = record.get('FormParameter');
                if (!FormParameter) return null;
                return FormParameter.ValueTypeID;
            }
        },
        {
            name: 'ValueType',
            convert: function (v, record) {
                var FormParameter = record.get('PropertyValueType');
                if (!FormParameter) return null;
                return FormParameter.Name;
            }
        }
    ]
});
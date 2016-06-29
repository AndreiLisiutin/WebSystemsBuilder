﻿Ext.define('WebSystemsBuilder.utils.mapping.ValueTypes', {
    alternateClassName: 'ValueTypes',
    singleton: true,
    init: function () {
        this.String = 1;
        this.Decimal = 2;
        this.Int = 3;
        this.Date = 4;
        this.Bool = 5;

        this._loadValueTypes();
    },

    _valueTypes: [],
    String: null,
    Decimal: null,
    Int: null,
    Date: null,
    Bool: null,

    _loadValueTypes: function () {
        var _this = this;
        Ext.Ajax.request({
            url: 'ValueTypes/GetValueTypes',
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            params: {},
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    _this._valueTypes = jsonResp.Data;
                } else {
                    WebSystemsBuilder.utils.MessageBox.error(jsonResp.resultMessage);
                }
            },
            failure: function (objServerResponse) {
                WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
            }
        });
    },

    getValueFromString: function (object, valueTypeID) {
        var _this = this;
        if (object == null || typeof object == 'undefined') {
            return null;
        }

        var valueType = _this._valueTypes.filter(function (obj) {
            return obj.ValueTypeID == valueTypeID;
        })[0];

        switch (valueTypeID) {
            case ValueTypes.String:
                return object.toString();
                break;
            case ValueTypes.Decimal:
                return parseFloat(object);
                break;
            case ValueTypes.Int:
                return parseInt(object);
                break;
            case ValueTypes.Date:
                return Ext.Date.parse(object, valueType ? (valueType.Format || 'c') : 'c');
                break;
            case ValueTypes.Bool:
                return object.toString().toLowerCase().trim() == 'true';
                break;
        }
    }
});
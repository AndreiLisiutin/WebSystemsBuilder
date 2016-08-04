Ext.define('WebSystemsBuilder.utils.mapping.ValueTypes', {
    alternateClassName: 'ValueTypes',
    singleton: true,
    requires: [
        'WebSystemsBuilder.utils.mapping.PredicateOperations'
    ],
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
                var format = _this._formatDateFormat(valueType.Format || 'c');
                return Ext.Date.parse(object, valueType ? format : 'c');
                break;
            case ValueTypes.Bool:
                return object.toString().toLowerCase().trim() == 'true';
                break;
            default:
                throw 'Unknown value type';
        }
    },

    _formatDateFormat: function (format) {
        if (!format) {
            return format;
        }
        return format.replace('dd', 'd')
            .replace('MM', 'm')
            .replace('yyyy', 'Y');
    },

    getStringFromValue: function (object, valueTypeID) {
        var _this = this;
        if (object == null || typeof object == 'undefined') {
            return null;
        }

        var valueType = _this._valueTypes.filter(function (obj) {
            return obj.ValueTypeID == valueTypeID;
        })[0];

        switch (valueTypeID) {
            case ValueTypes.String:
            case ValueTypes.Decimal:
            case ValueTypes.Int:
                return object.toString();
                break;
            case ValueTypes.Date:
                var format = _this._formatDateFormat(valueType.Format || 'c');
                return Ext.Date.format(object, valueType ? format : 'c');
                break;
            case ValueTypes.Bool:
                return object ? 'TRUE' : 'FALSE';
                break;
            default:
                throw 'Unknown value type';
        }
    },

    executePredicate: function (operand1, operand2, predicateOperationID, valueTypeID) {

        if (operand1 == null || typeof(operand1) == 'undefined' ||
            operand2 == null || typeof(operand2) == 'undefined') {
            return false;
        }

        switch (predicateOperationID) {
            case PredicateOperations.Equals:
                return +operand1 == +operand2;
                break;
            case PredicateOperations.NotEquals:
                return +operand1 != +operand2;
                break;
            case PredicateOperations.GreaterThan:
                return +operand1 > +operand2;
                break;
            case PredicateOperations.LowerThan:
                return +operand1 < +operand2;
                break;
            default:
                throw 'Unknown predicateOperationID';
        }
    }
});

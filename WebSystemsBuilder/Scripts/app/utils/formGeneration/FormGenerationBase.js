Ext.define('WebSystemsBuilder.utils.formGeneration.FormGenerationBase', {
    singleton: true,
    requires: [
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],

    createForm: function (formID) {
        var _this = this;
        formID = formID || 1;
        _this._getFormMeta(formID, function (formMeta) {
            var form = _this._buildForm(formMeta, formID);
            form.show();
        });
    },

    _getFormMeta: function (formID, callback) {
        var _this = this;
        Ext.Ajax.request({
            url: 'FormMeta/GetFormMetaDescriptions',
            async: false,
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            params: {
                formID: formID
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    callback(jsonResp.Data)
                } else {
                    WebSystemsBuilder.utils.MessageBox.error(jsonResp.resultMessage);
                }
            },
            failure: function (objServerResponse) {
                WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
            }
        });
    },

    _buildForm: function (formMeta, formID) {
        var _this = this;
        _this._consoleLog('Generating form #' + formID);
        return _this._testCreateControl(formMeta.RootControl);
    },

    _testCreateControl: function (controlInstance) {
        var _this = this;
        if (!controlInstance.Control || !controlInstance.Properties || !controlInstance.Properties.length) {
            throw 'Unable to build an empty control';
        }
        _this._consoleLog('Generating form #' + controlInstance.Control.FormID + ' control #' + controlInstance.Control.ControlID);
        var properties = controlInstance.Control;
        $.each(controlInstance.Properties, function (i, item) {
            var serializedValue = item.Property ? item.Property.Value
                : item.ControlTypePropertyType.DefaultValue;

            var realValue = ValueTypes.getValueFromString(serializedValue, item.PropertyType.ValueTypeID);
            properties[item.PropertyType.Name] = realValue;
        });

        if (controlInstance.ChildControls && controlInstance.ChildControls.length) {
            properties.items = [];
            $.each(controlInstance.ChildControls, function (i, item) {
                properties.items.push(_this._testCreateControl(item));
            });
        }

        return Ext.create(properties);
    },

    _consoleLog: function (text) {
        console.log('-----FormGenerationBase: ' + text);
    }
});

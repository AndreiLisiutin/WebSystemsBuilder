Ext.define('WebSystemsBuilder.utils.operands.BaseControlHandler', {
    extend: 'WebSystemsBuilder.utils.operands.BaseOperandHandler',
    alternateClassName: ['BaseControlHandler'],

    /**
     * {Ext.Component} ExtJS visual component object
     */
    _visualComponent: null,
    /**
     * maeta-descriptions of the component
     */
    _controlInstance: null,

    getControlID: function () {
        return this._controlInstance.Control.ControlID;
    },

    /**
     * Create visual component by meta-descriptions.
     * @param controlInstance meta-descriptions for control. Contains info about control's properties.
     * Struncture: WebSystemsBuilder.Server.Models.ControlInstance. See server code for more details
     * @param {Array[WebSystemsBuilder.utils.operands.BaseControlHandler]} innerHandlers already created BaseControlHandlers-child controls of current.
     * @returns {WebSystemsBuilder.utils.operands.BaseControlHandler} this
     */
    generateComponent: function (controlInstance, innerHandlers) {
        var _this = this;
        //soring meta-information
        _this._controlInstance = controlInstance;

        var properties = controlInstance.Control;
        //parsing and creating control's ExtJS properties
        $.each(controlInstance.Properties, function (i, item) {
            var serializedValue = item.Property ? item.Property.Value
                : item.ControlTypePropertyType.DefaultValue;

            var realValue = WebSystemsBuilder.utils.mapping.ValueTypes
                .getValueFromString(serializedValue, item.PropertyType.ValueTypeID);
            properties[item.PropertyType.Name] = realValue;
        });

        if (innerHandlers && innerHandlers.length) {
            //if there is nested visual components - push them into a special property, that is determined by nested components
            //for example, GridColumns array will apper in the "columns" property, Buttons array - in "items" property
            $.each(innerHandlers, function (i, item) {
                var arrayName = item.getSelfArrayName();
                properties[arrayName] = properties[arrayName] || [];
                properties[arrayName].push(item.getVisualComponent());
            });
        }

        //generate visual representation of current control
        this._visualComponent = _this.generateVisualComponent(properties);
        return this;
    },

    /**
     * Generate visual representation of current control
     * @param properties object with ExtJS properties. Property 'xtype' required.
     * @returns {Ext.Component} ExtJS visual component object
     */
    generateVisualComponent: function (properties) {
        if (!properties.xtype) {
            throw 'Unknown ExtJS visual component type.';
        }
        var visualComponent = Ext.create(properties);
        return visualComponent;
    },

    getVisualComponent: function (properties) {
        return this._visualComponent;
    },

    getSelfArrayName: function (properties) {
        return 'items';
    },
    //----------------------------------OPERAND-------------------------------------------------------------------------
    isOperand: function () {
        return false;
    },
    getOperandID: function () {
        return this._controlInstance.Control.OperandID;
    },
    getValueTypeID: function () {
        return this._controlInstance.ControlType.ValueTypeID;
    },
    getValue: function () {
        throw 'Component ' + this._getComponentClass() + ' has no value.';
    },
    setValue: function (value) {
        throw 'Component ' + this._getComponentClass() + ' has no value.';
    },
    setValueArray: function (arrayValue) {
        if (!arrayValue || arrayValue.length == 0) {
            arrayValue = [null];
        }

        if (this.getValue() !== arrayValue[0]) {
            this.setValue(arrayValue[0]);
        }
    },
    //----------------------------------EVENTS--------------------------------------------------------------------------
    bindLoad: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Load.';
    },
    bindClick: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Click.';
    },
    bindClose: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Close.';
    },
    bindChangeValue: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type ChangeValue.';
    },
    bindChangeSelection: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type ChangeSelection.';
    },
    //----------------------------------CLIENT ACTIONS------------------------------------------------------------------
    executeEnable: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type Enable.';
    },
    executeDisable: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type Disable.';
    },
    executeSetReadOnly: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type SetReadOnly.';
    },
    executeSetNotReadOnly: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type SetNotReadOnly.';
    },

    _getComponentClass: function () {
        var classPath = this.$className.split('.');
        return classPath[classPath.length - 1];
    }
});
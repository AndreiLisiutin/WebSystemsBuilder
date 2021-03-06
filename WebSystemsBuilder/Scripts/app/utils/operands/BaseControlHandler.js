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
            var name = item.PropertyType.Name || '';

            var realValue = WebSystemsBuilder.utils.mapping.ValueTypes
                .getValueFromString(serializedValue, item.PropertyType.ValueTypeID);
            properties[name] = realValue;
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

        //ExtJS required it for work
        delete properties.id;
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
        var _class = this._controlInstance.ControlType.ExtJsClass;
        if (!properties.xtype || !_class) {
            throw 'Unknown ExtJS visual component type.';
        }
        var visualComponent = Ext.create(_class, properties);
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
    /**
     * Bind handler to load (afterrender) event of the component
     * @param handler
     */
    bindLoad: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Load.';
    },
    /**
     * Bind handler to click event of the component
     * @param handler
     */
    bindClick: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Click.';
    },
    /**
     * Bind handler to close event of the component
     * @param handler
     */
    bindClose: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type Close.';
    },
    /**
     * Bind handler to change value event of the component
     * @param handler
     */
    bindChangeValue: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support event type ChangeValue.';
    },
    /**
     * Bind handler to change selection event of the component
     * @param handler
     */
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
    executeClose: function (handler) {
        throw 'Component ' + this._getComponentClass() + ' doesn\'t support client action type Close.';
    },

    _getComponentClass: function () {
        var classPath = this.$className.split('.');
        return classPath[classPath.length - 1];
    }
});
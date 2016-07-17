Ext.define('WebSystemsBuilder.utils.IDE.FormParametersIDE', {
    singleton: true,
    alternateClassName: ['FormParametersIDE'],

    Parameters: null,
    gridpanel: null,

    init: function (gridpanel) {
//        FormParameter
//        public int FormParameterID { get; set; }
//        public int FormID { get; set; }
//        public string Name { get; set; }
//        public bool IsPublic { get; set; }
//        public int ValueTypeID { get; set; }
//        public int OperandID { get; set; }
//        public int UniqueID { get; set; }

//        PropertyValueType
//        public int ValueTypeID { get; set; }
//        public string Name { get; set; }
//        public string Format { get; set; }
        this.Parameters = [];

        // load data into gridpanel
        if (gridpanel) {
            this.bindGridPanel(gridpanel);
            this.gridpanel.getStore().loadData(this.Parameters, false);
        }
    },

    bindGridPanel: function(gridpanel) {
        this.gridpanel = gridpanel;
    },

    getFormParameters: function () {
        return this.Parameters;
    },
    getFormParametersToSave: function (formID) {
        this.Parameters.forEach(function(currentParam) {
            currentParam.FormParameter.FormID = formID;
        });
        return this.Parameters;
    },

    getParameterByName: function (parameterName) {
        var foundParameter = null;

        if (this.Parameters.length > 0) {
            this.Parameters.forEach(function (currentParam) {
                if (currentParam.FormParameter.Name == parameterName) {
                    foundParameter = currentParam;
                }
            });
        }

        return foundParameter;
    },
    getParameterByUniqueID: function (uniqueID) {
        var foundParameter = null;

        if (this.Parameters.length > 0) {
            this.Parameters.forEach(function (currentParam) {
                if (currentParam.FormParameter.UniqueID == uniqueID) {
                    foundParameter = currentParam;
                }
            });
        }

        return foundParameter;
    },

    _checkParameterName: function (parameterName, uniqueID) {
        if (!parameterName) {
            return 'Parameter name should be non-empty';
        }
        var onlyAlphaNumeric = Ext.form.VTypes.alphanum(parameterName);
        if (!onlyAlphaNumeric) {
            return 'Parameter name should be alphanumeric - "' + parameterName + '"';
        }
        if (Ext.Array.contains('0123456789_', parameterName[0])) {
            return 'Parameter name should begin with letter - "' + parameterName + '"';
        }
        var foundParameter;
        this.Parameters.forEach(function (currentParam) {
            if (currentParam.FormParameter.Name == parameterName && currentParam.FormParameter.UniqueID != (uniqueID || 0)) {
                foundParameter = currentParam;
            }
        });
        if (foundParameter) {
            return 'Parameter name alerady exists - "' + parameterName + '"';
        }
        return '';
    },

    addParameter: function (parameter) {
        var ckeckNameError = this._checkParameterName(parameter.FormParameter.Name);
        if (ckeckNameError) {
            console.error('FormParametersIDE.addParameter: ' + ckeckNameError);
            return false;
        }

        if (!parameter.FormParameter.UniqueID) {
            if (parameter.FormParameter.OperandID > 0) {
                parameter.FormParameter.UniqueID = parameter.FormParameter.OperandID;
            } else {
                parameter.FormParameter.UniqueID = RandomIDE.get();
            }
        }
        this.Parameters.push(parameter);

        // load data into gridpanel
        if (this.gridpanel) {
            this.gridpanel.getStore().loadData(this.Parameters, false);
        }
        return true;
    },

    editParameter: function (parameter) {
        var ckeckNameError = this._checkParameterName(parameter.FormParameter.Name, parameter.FormParameter.UniqueID);
        if (ckeckNameError) {
            console.error('FormParametersIDE.editParameter: ' + ckeckNameError);
            return false;
        }

        var currentParameter = this.getParameterByUniqueID(parameter.FormParameter.UniqueID);
        if (currentParameter) {
            var index = Ext.Array.indexOf(this.Parameters, currentParameter);
            if (index != -1) {
                this.Parameters[index] = parameter;
                // load data into gridpanel
                if (this.gridpanel) {
                    this.gridpanel.getStore().loadData(this.Parameters, false);
                }

                return true;
            } else {
                console.error('FormParametersIDE.editParameter: can\'t find index of parameter "' + currentParameter.FormParameter.Name + '"');
                return false;
            }
        } else {
            console.error('FormParametersIDE.editParameter: can\'t find parameter "' + parameter.FormParameter.Name + '"');
            return false;
        }
    },

    deleteParameter: function (uniqueID) {
        var foundParameter = this.getParameterByUniqueID(uniqueID);
        if (foundParameter) {
            Ext.Array.remove(this.Parameters, foundParameter);
            // load data into gridpanel
            if (this.gridpanel) {
                this.gridpanel.getStore().loadData(this.Parameters, false);
            }
        } else {
            console.error('FormParametersIDE.deleteParameter: can\'t find parameter [uniqueID="' + uniqueID + '"]');
        }
    },

    clear: function () {
        this.Parameters = [];
        // load data into gridpanel
        if (this.gridpanel) {
            this.gridpanel.getStore().loadData(this.Parameters, false);
        }
    }

});
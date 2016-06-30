Ext.define('WebSystemsBuilder.utils.IDE.FormParametersIDE', {
    singleton: true,
    alternateClassName: ['FormParametersIDE'],

    Parameters: null,

    init: function () {
//        {
//            Name: 'name',
//            Type: 'type',
//            UniqueID: 'id'
//        }
        this.Parameters = [];
    },

    getFormParameters: function () {
        return this.Parameters;
    },

    getParameterByName: function (parameterName) {
        var foundParameter = null;

        if (this.Parameters.length > 0) {
            this.Parameters.forEach(function (currentParam) {
                if (currentParam.Name == parameterName) {
                    foundParameter = currentParam;
                }
            });
        }

        return foundParameter;
    },
    getParameterByID: function (uniqueID) {
        var foundParameter = null;

        if (this.Parameters.length > 0) {
            this.Parameters.forEach(function (currentParam) {
                if (currentParam.UniqueID == uniqueID) {
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
            if (currentParam.Name == parameterName && currentParam.UniqueID != (uniqueID || 0)) {
                foundParameter = currentParam;
            }
        });
        if (foundParameter) {
            return 'Parameter name alerady exists - "' + parameterName + '"';
        }
        return '';
    },

    addParameter: function (parameter) {
        var ckeckNameError = this._checkParameterName(parameter.Name);
        if (ckeckNameError) {
            console.error('FormParametersIDE.addParameter: ' + ckeckNameError);
            return false;
        }

        if (!parameter.UniqueID) {
            parameter.UniqueID = Random.get();
        }
        this.Parameters.push(parameter);
        return true;
    },

    editParameter: function (parameter) {
        var ckeckNameError = this._checkParameterName(parameter.Name, parameter.UniqueID);
        if (ckeckNameError) {
            console.error('FormParametersIDE.editParameter: ' + ckeckNameError);
            return false;
        }

        var currentParameter = this.getParameterByID(parameter.UniqueID);
        if (currentParameter) {
            var index = Ext.Array.indexOf(this.Parameters, currentParameter);
            if (index != -1) {
                this.Parameters[index] = parameter;
                return true;
            } else {
                console.error('FormParametersIDE.editParameter: can\'t find index of parameter "' + currentParameter.Name + '"');
                return false;
            }
        } else {
            console.error('FormParametersIDE.editParameter: can\'t find parameter "' + parameter.Name + '"');
            return false;
        }
    },

    deleteParameter: function (uniqueID) {
        var foundParameter = this.getParameterByID(uniqueID);
        if (foundParameter) {
            Ext.Array.remove(this.Parameters, foundParameter);
        } else {
            console.error('FormParametersIDE.deleteParameter: can\'t find parameter [uniqueID="' + uniqueID + '"]');
        }
    },

    clear: function () {
        this.Parameters = [];
    }

});
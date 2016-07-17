Ext.define('WebSystemsBuilder.utils.IDE.QueryInParametersIDE', {
    alternateClassName: ['QueryInParametersIDE'],

//        'UniqueID',
//        'Name',
//        'QueryParameterTypeID',  Control-1, FormParameter-2
//        'QueryParameterType'
//        'QueryTypeID'   S-1, I-2, D-3
    Parameters: [],
    gridpanel: null,
    QueryTypeID: null,

    init: function (gridpanel) {
        this.Parameters = [];
        this.QueryTypeID = 1;
        // load data into gridpanel
        if (gridpanel) {
            this.bindGridPanel(gridpanel);
            this.updateGridPanel();
        }
    },
    bindGridPanel: function (gridpanel) {
        this.gridpanel = gridpanel;
    },
    setQueryType: function (queryTypeID) {
        this.QueryTypeID = queryTypeID || 1;
        this.updateGridPanel();
    },
    updateGridPanel: function () {
        var _this = this;
        if (_this.gridpanel) {
            _this.gridpanel.getStore().loadData(_this.getUniqueQueryInParameters(), false);
        }
    },

    getQueryInParameters: function () {
        return this.Parameters;
    },
    getUniqueQueryInParameters: function () {
        var _this = this;
        var list = [];
        var hasUniqueParameter = function (uniqueID) {
            var hasParam = false;
            list.forEach(function (currentParameter_) {
                if (currentParameter_.UniqueID == uniqueID) {
                    hasParam = true;
                }
            });
            return hasParam;
        };
        _this.Parameters.forEach(function (currentParameter) {
            if (!hasUniqueParameter(currentParameter.UniqueID) && currentParameter.QueryTypeID == _this.QueryTypeID) {
                list.push(currentParameter);
            }
        });
        return list;
    },
    getParameterByUniqueID: function (uniqueID, queryTypeID) {
        var foundParameter = null;

        if (this.Parameters.length > 0) {
            this.Parameters.forEach(function (currentParam) {
                if (currentParam.FormParameter.UniqueID == uniqueID) {
                    if (queryTypeID && queryTypeID == currentParam.QueryTypeID) {
                        foundParameter = currentParam;
                    }
                }
            });
        }

        return foundParameter;
    },

    addParameter: function (parameter) {
        this.Parameters.push(parameter);
        this.updateGridPanel();
    },
    deleteParameter: function (uniqueID, queryTypeID) {
        var foundParameter = this.getParameterByUniqueID(uniqueID, queryTypeID);
        if (foundParameter) {
            Ext.Array.remove(this.Parameters, foundParameter);
        } else {
            console.error('QueryInParametersIDE.deleteParameter: can\'t find parameter [uniqueID="' + uniqueID + '"]');
        }
        this.updateGridPanel();
    },

    clear: function () {
        this.Parameters = [];
        this.updateGridPanel();
    }

});
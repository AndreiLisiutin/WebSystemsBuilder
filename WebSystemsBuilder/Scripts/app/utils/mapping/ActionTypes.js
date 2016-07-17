Ext.define('WebSystemsBuilder.utils.mapping.ActionTypes', {
    alternateClassName: 'ActionTypes',
    singleton: true,

    init: function () {
        this.Client = 1;
        this.OpenForm = 2;
        this.Predicate = 3;
        this.Server = 4;
        this.Query = 5;
    },

    Client: null,
    OpenForm: null,
    Predicate: null,
    Server: null,
    Query: null,

    getActionTypeName: function(actionTypeID) {
        var _this = this;
        switch (actionTypeID){
            case _this.Client:
                return 'Client action';
            case _this.OpenForm:
                return 'Open form action';
            case _this.Predicate:
                return 'Predicate action';
            case _this.Server:
                return 'Server action';
            case _this.Query:
                return 'Query action';
        }
    }
});

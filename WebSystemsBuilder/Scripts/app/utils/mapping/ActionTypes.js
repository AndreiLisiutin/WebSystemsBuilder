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
    Query: null
});

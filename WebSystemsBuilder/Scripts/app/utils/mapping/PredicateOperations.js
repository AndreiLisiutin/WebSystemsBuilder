Ext.define('WebSystemsBuilder.utils.mapping.PredicateOperations', {
    alternateClassName: 'PredicateOperations',
    singleton: true,
    init: function () {
        this.Equals = 1;
        this.NotEquals = 2;
        this.GreaterThan = 3;
        this.LowerThan = 4;
    },

    Equals: null,
    NotEquals: null,
    GreaterThan: null,
    LowerThan: null
});

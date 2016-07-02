Ext.define('WebSystemsBuilder.utils.mapping.EventTypes', {
    alternateClassName: 'EventTypes',
    singleton: true,
    init: function () {
        this.Load = 1;
        this.Click = 2;
        this.Close = 3;
        this.ChangeValue = 4;
        this.ChangeSelection = 5;
    },

    Load: null,
    Click: null,
    Close: null,
    ChangeValue: null,
    ChangeSelection: null
});
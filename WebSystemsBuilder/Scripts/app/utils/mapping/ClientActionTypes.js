Ext.define('WebSystemsBuilder.utils.mapping.ClientActionTypes', {
    alternateClassName: 'ClientActionTypes',
    singleton: true,

    init: function () {
        this.Enable = 1;
        this.Disable = 2;
        this.SetReadOnly = 3;
        this.SetNotReadOnly = 4;
        this.Close = 5;
    },

    Enable: null,
    Disable: null,
    SetReadOnly: null,
    SetNotReadOnly: null,
    Close: null
});

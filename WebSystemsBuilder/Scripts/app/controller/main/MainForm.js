Ext.define('WebSystemsBuilder.controller.main.MainForm', {
    extend: 'Ext.app.Controller',
    views: [
        'WebSystemsBuilder.view.main.MainForm'
    ],
    requires: [
        'WebSystemsBuilder.utils.formGeneration.FormGenerationBase',
        'WebSystemsBuilder.utils.mapping.ActionTypes',
        'WebSystemsBuilder.utils.mapping.ValueTypes',
        'WebSystemsBuilder.utils.mapping.ControlTypes',
        'WebSystemsBuilder.utils.mapping.EventTypes',
        'WebSystemsBuilder.utils.mapping.ClientActionTypes',
        'WebSystemsBuilder.utils.mapping.PredicateOperations'
    ],

    init: function () {
        this.control({
            'MainForm button[action=onOpenIDE]': {
                click: this.onOpenIDE
            },
            'MainForm button[name=test]': {
                click: this.test
            }
        });

        WebSystemsBuilder.utils.mapping.ValueTypes.init();
        WebSystemsBuilder.utils.mapping.ActionTypes.init();
        WebSystemsBuilder.utils.mapping.ControlTypes.init();
        WebSystemsBuilder.utils.mapping.EventTypes.init();
        WebSystemsBuilder.utils.mapping.ClientActionTypes.init();
        WebSystemsBuilder.utils.mapping.PredicateOperations.init();
    },

    onOpenIDE: function (button) {
        // WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.MainIDE');
        // WebSystemsBuilder.utils.Windows.open('MainIDE');
       WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryAction');
       WebSystemsBuilder.utils.Windows.open('QueryAction');
    },

    test: function () {
        WebSystemsBuilder.utils.formGeneration.FormGenerationBase.createForm(1);
    }
});

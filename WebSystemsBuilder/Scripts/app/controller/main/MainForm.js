Ext.define('WebSystemsBuilder.controller.main.MainForm', {
    extend: 'Ext.app.Controller',
    views: [
        'WebSystemsBuilder.view.main.MainForm'
    ],
    requires: [
        'WebSystemsBuilder.utils.formGeneration.FormGenerationBase',
        'WebSystemsBuilder.utils.mapping.ValueTypes'
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
    },

    onOpenIDE: function (button) {
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.MainIDE');
        WebSystemsBuilder.utils.Windows.open('MainIDE');
    },

    test: function () {
        WebSystemsBuilder.utils.formGeneration.FormGenerationBase.createForm(1);
    }
});

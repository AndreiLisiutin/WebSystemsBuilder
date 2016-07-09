Ext.application({
    extend: 'Ext.app.Application',

    name: 'WebSystemsBuilder',
    appFolder: 'Scripts/app',

    requires: [
        'WebSystemsBuilder.utils.DefaultConfiguration',
        'WebSystemsBuilder.utils.Windows',
        'WebSystemsBuilder.utils.MessageBox',
        'WebSystemsBuilder.utils.CommonUtils',
        'WebSystemsBuilder.utils.ControllerLoader',
        'WebSystemsBuilder.utils.IDE.Focused',
        'WebSystemsBuilder.utils.IDE.Random',
        'WebSystemsBuilder.utils.IDE.ControlTypeDependencies',
        'WebSystemsBuilder.utils.IDE.MousedComponentsIDE',
        'WebSystemsBuilder.utils.IDE.FormParametersIDE',
        'WebSystemsBuilder.utils.IDE.FormControlsIDE',
        'WebSystemsBuilder.utils.mapping.EventTypeControlTypes',

        'WebSystemsBuilder.utils.controlTypes.ComponentFactoryUtils',
        'WebSystemsBuilder.utils.controlTypes.BaseComponentFactory',
        'WebSystemsBuilder.utils.controlTypes.ButtonFactory',
        'WebSystemsBuilder.utils.controlTypes.ComboBoxFactory',
        'WebSystemsBuilder.utils.controlTypes.ContainerFactory',
        'WebSystemsBuilder.utils.controlTypes.DateColumnFactory',
        'WebSystemsBuilder.utils.controlTypes.DateFieldFactory',
        'WebSystemsBuilder.utils.controlTypes.FieldSetFactory',
        'WebSystemsBuilder.utils.controlTypes.GridColumnFactory',
        'WebSystemsBuilder.utils.controlTypes.GridPanelFactory',
        'WebSystemsBuilder.utils.controlTypes.NumberColumnFactory',
        'WebSystemsBuilder.utils.controlTypes.NumberFieldFactory',
        'WebSystemsBuilder.utils.controlTypes.PanelFactory',
        'WebSystemsBuilder.utils.controlTypes.TabFactory',
        'WebSystemsBuilder.utils.controlTypes.TabPanelFactory',
        'WebSystemsBuilder.utils.controlTypes.TextFieldFactory',
        'WebSystemsBuilder.utils.controlTypes.ToolbarFactory',
        'WebSystemsBuilder.utils.controlTypes.WindowFactory'
    ],

    init: function() {
        WebSystemsBuilder.utils.DefaultConfiguration.defineConfiguration();
        ControlTypeDependencies.init();
        Focused.init();
        MousedComponentsIDE.init();
        FormParametersIDE.init();
        EventTypeControlTypes.init();
    },

    launch: function () {
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.main.MainForm');
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: {
                xtype: 'MainForm'
            }
        }).show();
    }
});

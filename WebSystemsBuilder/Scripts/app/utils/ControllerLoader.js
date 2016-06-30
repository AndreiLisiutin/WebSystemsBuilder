Ext.define('WebSystemsBuilder.utils.ControllerLoader', {
    singleton: true,
    alternateClassName: 'ControllerLoader',

    load: function (controller) {
        var app = WebSystemsBuilder.getApplication();
        var loadedController = app.getController(controller);
        return loadedController;
    }
});
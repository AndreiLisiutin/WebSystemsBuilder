Ext.define('WebSystemsBuilder.utils.ControllerLoader', {
    singleton: true,
    load: function (controller) {
        var app = WebSystemsBuilder.getApplication();
        loadedController = app.getController(controller);        
        return loadedController;
    }
});
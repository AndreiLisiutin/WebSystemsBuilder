Ext.define('WebSystemsBuilder.utils.ControllerLoader', {
    singleton: true,
    load: function (controller) {
        return WebSystemsBuilder.getApplication().getController(controller);
    }
});
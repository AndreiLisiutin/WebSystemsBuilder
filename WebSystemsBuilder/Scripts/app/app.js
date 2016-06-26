/**
 * The main application class. This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.application({
    extend: 'Ext.app.Application',
    requires: [
        'IDE.view.main.Main'
    ],
    
    name: 'IDE',
    appFolder: 'Scripts/app',

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    mainView: 'IDE.view.main.Main',

    launch: function () {
        // TODO - Launch the application
    }
});

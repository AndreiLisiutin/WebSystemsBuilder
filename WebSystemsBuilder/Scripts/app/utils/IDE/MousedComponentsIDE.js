Ext.define('WebSystemsBuilder.utils.IDE.MousedComponentsIDE', {
    singleton: true,
    alternateClassName: ['MousedComponentsIDE'],

    MousedStack: null,

    init: function() {
        this.MousedStack = [];
    },

    getMousedComponents: function () {
        return this.MousedStack;
    },

    getUpperMousedComponent: function () {
        if (this.MousedStack.length > 0) {
            return this.MousedStack[0];
        }
        return null;
    },

    pushMousedComponent: function (component) {
        if (component) {
            this.MousedStack.push(component);
        }
    },

    popMousedComponent: function (popMousedComponent) {
        if (this.MousedStack.length > 0) {
            return this.MousedStack.pop(popMousedComponent);
        } else {
            return null;
        }
    },

    clearMousedComponents: function () {
        this.MousedStack = [];
    }
});
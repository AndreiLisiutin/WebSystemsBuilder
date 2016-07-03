Ext.define('WebSystemsBuilder.utils.IDE.FormControlsIDE', {
    singleton: true,
    alternateClassName: ['FormControlsIDE'],

    availableControlTypes: [
        'button', 'combobox', 'container', 'datecolumn', 'datefield', 'fieldset',
        'gridcolumn', 'gridpanel', 'numbercolumn', 'numberfield',
        'panel', 'tab', 'tabpanel', 'textfield', 'toolbar'
    ],
    form: null,

    init: function(form) {
        this.form = form;
    },

    getControlList: function () {
        var _this = this;
        var localWindow = _this.form.down();
        var controlList = [];

        var GetMetaDescriptionsRecursive = function (item) {
            if (item == null || typeof item == 'undefined') {
                return null;
            }

            var items = [];
            if (item.query) {
                var query = item.query('> component');
                if (item.xtype == 'gridpanel') {
                    query = query.concat(item.columnManager.columns);
                }
                // query all children
                query.forEach(function (child) {
                    if (child && child.xtype && Ext.Array.contains(_this.availableControlTypes, child.xtype) &&
                        child.name && child.name.startsWith('sencha')) {
                        items.push(child);
                    }
                });
            }

            // create obj
            var componentInfo = JSON.parse(JSON.stringify(item.componentInfo));
            controlList.push({componentInfo: componentInfo});

            // recursion
            if (items.length > 0) {
                items.forEach(function (childItem) {
                    GetMetaDescriptionsRecursive(childItem);
                });
            }
        };

        GetMetaDescriptionsRecursive(localWindow);

        return controlList;
    }

});
Ext.define('WebSystemsBuilder.utils.IDE.DragDropComponents', {
    singleton: true,
    alternateClassName: ['DragDropComponents'],

    ControlTypeDependencies: null,
    ready: false,
    init: function () {
        this.getComponents();
    },

    getComponents: function() {
        var _this = this;
        _this.ControlTypeDependencies = [];

        Ext.Ajax.request({
            url: 'MainIDE/GetControlTypeDependencies',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    _this.ControlTypeDependencies = jsonResp.Data;
                    _this.ready = true;

                } else {
                    WebSystemsBuilder.utils.MessageBox.error(jsonResp.Message);
                }
            },
            failure: function (objServerResponse) {
                WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
            }
        });
    },

    getDependencies: function(parentControlID) {
        if (!this.ready || !this.ControlTypeDependencies) {
            WebSystemsBuilder.utils.MessageBox.error('Dependencies list has not loaded yet');
            return;
        }
        if (!parentControlID) {
            WebSystemsBuilder.utils.MessageBox.error('Parent control type ID is not typed');
            return;
        }

        var childControlIDList = [];
        this.ControlTypeDependencies.forEach(function(item) {
            if (item.ControlTypeIDParent == parentControlID) {
                childControlIDList.push(item.ControlTypeIDChild);
            }
        });

        return childControlIDList;
    }
});
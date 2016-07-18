Ext.define('WebSystemsBuilder.utils.mapping.EventTypeControlTypes', {
    alternateClassName: 'EventTypeControlTypes',
    singleton: true,

    EventTypeControlTypeList: null,

    get: function () {
        return this.EventTypeControlTypeList;
    },

    getByControlTypeID: function (controlTypeID) {
        var list = [];
        this.EventTypeControlTypeList.forEach(function (currentEventTypeControlType) {
            if (currentEventTypeControlType.ControlTypeID == controlTypeID) {
                list.push(currentEventTypeControlType);
            }
        });
        return list;
    },

    init: function () {
        var _this = this;
        _this.EventTypeControlTypeList = [];

        Ext.Ajax.request({
            url: 'EventType/GetEventTypeControlTypeList',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    _this.EventTypeControlTypeList = jsonResp.Data;

                } else {
                    MessageBox.error(jsonResp.Message);
                }
            },
            failure: function (objServerResponse) {
                MessageBox.error(objServerResponse.responseText);
            }
        });
    }
});
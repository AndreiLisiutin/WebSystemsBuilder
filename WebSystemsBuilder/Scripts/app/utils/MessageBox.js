Ext.define('WebSystemsBuilder.utils.MessageBox', {
    extend: 'Ext.window.MessageBox',
    singleton: true,
    alternateClassName: 'MessageBox',

    init: function () {
        this.addEvents(['confirm', 'ok', 'abort', 'cancel']);
        this.callParent(arguments);
    },

    show: function (message, bt, resultCode) {
        return this.showEx(message, bt, resultCode, {});
    },

    error: function (message, fn) {
        Ext.Msg.on('show', function () {
            Ext.Msg.doComponentLayout();
            Ext.Msg.doLayout();
        }, this, { single: true });

        return Ext.Msg.show({
            title: 'Сообщение',
            msg: message,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.ERROR,
            fn: fn
        });
    },

    warning: function (message) {
        Ext.Msg.on('show', function () {
            Ext.Msg.doComponentLayout();
            Ext.Msg.doLayout();
        }, this, { single: true });

        return Ext.Msg.show({
            title: 'Сообщение',
            msg: message,
            buttons: Ext.Msg.OK,
            icon: Ext.MessageBox.WARNING
        });
    },

    question: function (msg, fn, bt) {
        var b = bt;
        if (b == undefined)
            b = Ext.Msg.YESNO;
        var me = this;
        return Ext.Msg.show({
            title: 'Подтверждение',
            msg: msg,
            buttons: b,
            icon: Ext.Msg.QUESTION,
            fn: function (res) {
                if (fn != undefined) {
                    fn(res);
                    me.fireEvent('answer', res);
                }
            }
        });
    },

    showEx: function (message, bt, resultCode, cfg) {
        var buttons = bt == undefined ? Ext.Msg.OK : bt;
        var title;
        if (bt != undefined && bt == Ext.Msg.OK) {
            title = 'Сообщение';
        }
        else {
            title = 'Подтверждение';
        }
        var icon;
        switch (resultCode) {
            case 0:
                icon = Ext.MessageBox.INFO;
                break;
            case 1:
                icon = Ext.MessageBox.WARNING;
                break;
            case -1:
                icon = Ext.MessageBox.ERROR;
                break;
            default:
                icon = Ext.MessageBox.INFO;
        }

        Ext.Msg.on('show', function () {
            Ext.Msg.doComponentLayout();
            Ext.Msg.doLayout();
        }, this, { single: true });

        cfg = Ext.Object.merge({
            title: title,
            msg: message,
            buttons: buttons,
            icon: icon
        }, cfg);
        return Ext.Msg.show(cfg);
    }
});
Ext.define('WebSystemsBuilder.utils.Windows', {
    extend: 'Ext.util.Observable',
    singleton: true,
    //----------------------------------------------------------
    //Открыть новое окно.
    //----------------------------------------------------------
    open: function (winxtype, options, noMaximize, modal, single, noShow, formConstraint) {
        var _this = this;
        formConstraint = formConstraint || false;
        noShow = noShow || false;
        var win;

        try {
            if (modal) {
                win = Ext.widget(winxtype, {
                    maximizable: !noMaximize
                });
            } else {
                //Ищем существующие окна
                var wins = Ext.ComponentQuery.query('[xtype=' + winxtype + ']');
                //Если окно одиночное
                if (single) {
                    //существующее окно выводим на передний план
                    if (wins && wins.length > 0) {
                        wins[0].show();
                        wins[0].toFront(true);
                        return wins[0];
                    } else {
                        //Если окна нет, то создаем его
                        win = Ext.widget(winxtype, {
                            maximizable: !noMaximize
                        });
                    }
                } else {
                    //Если окно не одиночное, то перебираем существующие окна.

                    //Ищем максимальный индекс все открытых окон, данного типа
                    var index = 0;
                    if (wins && (wins.length > 0)) {
                        for (var i = 0; i < wins.length; i++) {
                            if (wins.index > index) index = wins.index;
                        }
                        index++;
                    }
                    //Создаем окно, с index+1
                    win = Ext.widget(winxtype, {
                        maximizable: !noMaximize
                    });
                    if (index > 0) {
                        win.index = index;
                        win.title = win.title + ' (' + win.index + ')';
                    }
                }
            }

            //установка дополнительных свойств
            if (options) {
                for (var prop in options) {
                    win[prop] = options[prop];
                }
            }

            win['constrain'] = true;

            _this._addWindowToConstrainElement(win);

            win.center(Ext.Element.get('panelMainForm'));

            if (!noShow) {
                win.show();
            }

            return win;
        }
        catch (exception) {
            console.error('ОШИБКА ПРИ ОТКРЫТИИ ФОРМЫ:');
            console.error(exception.toString());
            console.error('СТЕК:');
            console.error(exception.stack);
            return win;
        }
    },

    openCustomized: function (paramseters, options) {
        var _this = this;
        options = options || {};
        var win = new Ext.window.Window(paramseters);
        if (!options.noShow) {
            win.show();
        }
        _this._addWindowToConstrainElement(win);
        return win;
    },

    _addWindowToConstrainElement: function (win) {
        //можно сделать окно распахиваемым не на все
        var _constrainComponent = Ext.ComponentQuery.query('[_constrainComponent=true]');
        if (_constrainComponent.length == 1) {
            _constrainComponent[0].add(win);
        }
    }
});
Ext.define('WebSystemsBuilder.controller.editor.query.FormQueries', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.editor.query.FormQueries'
    ],

    models: [
        'WebSystemsBuilder.model.editor.FormEditor'
    ],

    stores: [
        'WebSystemsBuilder.store.editor.FormEditor'
    ],

    init: function () {
        this.control({
            'FormQueries': {
                afterrender: this.onLoad
            },
            'FormQueries button[action=onSave]': {
                click: this.onSave
            },
            'FormQueries button[action=onAddQueryType]': {
                click: this.onAddQueryType
            },
            'FormQueries button[action=onViewQueryType]': {
                click: this.onViewQueryType
            },
            'FormQueries button[action=onSetParam]': {
                click: this.onSetParam
            },
            'FormQueries combobox[name=query]': {
                change: this.onQueryTypeSelectionChange
            },
            'FormQueries button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var queryTypes = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        queryTypes.getStore().load();
    },

    /**
     * Задать параметр запроса
     * @param btn
     */
    onSetParam:function(btn){
        var win = btn.up('window');
        var form = win.form;
        var query = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        var selection = inParams.getSelectionModel().getSelection()[0];
        if (!selection){
            var error = 'Выберите параметр.';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
        } else {
            var objs = form.query('datefield, combobox, textfield');
            var data = [];
            objs.forEach(function(x){
                var name = x.record.get('properties')['name'];
                var xtype = x.record.get('properties')['xtype'];
                var label = x.record.get('properties')['fieldLabel'];
                var item = {
                    ID: name,
                    name: xtype + ' (label="' + label + '", name="' + name + '")'
                };
                data.push(item);
            });
            WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.editor.common.ComboForm');
            var comboDialog = WebSystemsBuilder.utils.Windows.open('ComboForm', {
                _data: data,
                _label:'Компонент',
                _title:'Значение входного параметра'
            }, null, true);
            comboDialog.on('ComboSaved', function (winDialog, combo, combo_raw) {
                var items = inParams.getStore().data.items;
                items.forEach(function (item) {
                    if (item.get('ID') == selection.get('ID')) {
                        item.set('rawValue', combo_raw); // строка с name
                        item.set('value', combo); // name компонента
                        item.commit();
                    }
                });
            });
        }
    },

    /**
     * Перегрузить таблицу параметров при выборе типа запроса
     * @param combo Комбо типа запроса
     */
    onQueryTypeSelectionChange:function(combo){
        var win = combo.up('window');
        var query = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        if (!query.getValue()){
            inParams.getStore().loadData([], false);
        } else {
            inParams.getStore().load({
                params: {
                    ID: query.getValue() + ''
                }
            });
        }
    },

    /**
     * Функция добавления нового запроса к существующим
     * @param btn Кнопка "+", вызвавшая событие
     */
    onAddQueryType:function(btn){
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.editor.query.CreateQuery');
        var createQuery = WebSystemsBuilder.utils.Windows.open('CreateQuery',{}, null, true);
        createQuery.on('QuerySaved', function (winQuery, query_id) {
            // перегрузить комбо с запросами
            query.getStore().load({
                callback:function(){
                    var newQuery = query.getStore().findRecord('ID', query_id);
                    if (newQuery) {
                        query.setValue(query_id);
                    }
                }
            });
        });
    },

    /**
     * Функция редактирования типа запроса
     * @param btn Кнопка, вызвавшая событие
     */
    onViewQueryType:function(btn){
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        if (!query.getValue()){
            var error = 'Не выбран тип запроса';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
            return;
        }
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.editor.query.CreateQuery');
        var createQuery = WebSystemsBuilder.utils.Windows.open('CreateQuery',{
            queryTypeID:query.getValue()
        }, null, true);
    },

    /**
     * Функция сохранения запроса
     */
    onSave:function (btn) {
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        var inParams = win.down('gridpanel[name=inParams]');
        var error = '';
        inParams.getStore().data.items.forEach(function(item){
            if (!item.get('value')){
                error = 'Не все значения входных параметров заполнены.';
            }
        });
        // Если параметры не заполнены, ошибка
        if (error){
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
            return;
        }

        var ID = WebSystemsBuilder.editor.Random.get(); // случайный не настоящий ID
        var obj = {
            ID:ID,
            _ID:ID, // случайный не настоящий ID
            queryTypeID:query.getValue(),
            sqlText:query.getRawValue(),
            queryInParams:inParams.getStore().data.items
        };
        // Сгененировать событие, сообщающее основной форме о том,
        // что запрос сохранен
        win.fireEvent('FormQuerySaved', win, obj);
        this.onClose(btn);
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        var win = btn.up('FormQueries');
        if (win && win.close) {
            win.close();
        }
    }

});
Ext.define('WebSystemsBuilder.controller.IDE.query.QueryAction', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.query.QueryAction'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.query.QueryAction'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.query.QueryAction'
    ],

    init: function () {
        this.control({
            'QueryAction': {
                afterrender: this.onLoad
            },
            // Data table section (FROM)
            'QueryAction button[action=onAddDataTable]': {
                click: this.onAddDataTable
            },
            'QueryAction button[action=onDeleteDictionary]': {
                click: this.onDeleteDataTable
            },
            // Column section (SELECT)
            'QueryAction button[action=onAddField]': {
                click: this.onAddColumn
            },
            'QueryAction button[action=onDeleteField]': {
                click: this.onDeleteColumn
            },
            // Conditions section (WHERE)
            'QueryAction button[action=onAddConditionAnd], button[action=onAddConditionOr]': {
                click: this.onAddCondition
            },
            'QueryAction button[action=onDeleteCondition]': {
                click: this.onDeleteCondition
            },
            'QueryAction button[action=onRefreshSQL]': {
                click: this.onRefreshSQL
            },
            'QueryAction button[action=onSave]': {
                click: this.onSave
            },
            'QueryAction button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Функция инициализации компонентов формы. Вызывается сразу после загрузке формы (afterrender).
     * @param win Окно, представляющее данную форму.
     */
    onLoad: function (win) {
        var fieldsGrid = win.down('gridpanel[name=columnsGrid]');
        var dictsGrid = win.down('gridpanel[name=dataTablesGrid]');
        var condGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryString = win.down('textareafield[name=queryString]');
        var btnSave = win.down('button[action=onSave]');
        var btnRefresh = win.down('button[action=onRefreshSQL]');

        if (win.queryTypeID) {
            fieldsGrid.up('fieldset').setDisabled(true);
            dictsGrid.up('fieldset').setDisabled(true);
            condGrid.up('fieldset').setDisabled(true);
            queryString.setReadOnly(true);
            btnSave.disable();
            btnRefresh.disable();
            Ext.Ajax.request({
                url: 'QueryEditor/GetFullQueryType',
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                params: {
                    ID: win.queryTypeID + ''
                },
                success: function (objServerResponse) {
                    var jsonResp = Ext.decode(objServerResponse.responseText);
                    win.body.unmask();
                    if (jsonResp.Code == 0) {
                        var obj = jsonResp.Data;
                        queryString.setValue(obj.queryType['sqlText']);
                    } else {
                        WebSystemsBuilder.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                    }
                },
                failure: function (objServerResponse) {
                    win.body.unmask();
                    WebSystemsBuilder.utils.MessageBox.show(objServerResponse.responseText, null, -1);
                }
            });
        }
    },

    /**
     * Получить объект для сохранения запроса
     * @param win Окно
     * @returns {{queryType: {SQL: string, ID: number}, queryInParameters: Array, queryOutParameters: Array}}
     */
    getObject: function (win) {
        var _this = this;
        var fieldsGrid = win.down('gridpanel[name=columnsGrid]');
        var dictsGrid = win.down('gridpanel[name=dataTablesGrid]');
        var condGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryString = win.down('textareafield[name=queryString]');
        var SQL = _this.getQuery(win.down('button'));
        var inParams = [], outParams = [];

        fieldsGrid.getStore().data.items.forEach(function (item) {
            var obj = item.get('obj');
            var outParam = {
                ID: -1,
                queryTypeID: -1,
                name: obj.table.field['columnName'], //obj.table['tableName'] + '.' + obj.table.field['columnName'];
                domainValueTypeID: item.get('domainValueTypeID')
            };
            outParams.push(outParam);
        });

        // where
        condGrid.getStore().data.items.forEach(function (item) {
            var obj = item.get('obj');
            if (!Ext.Array.contains(['IS NULL', 'IS NOT NULL'], (obj['condition'] || '').trim().toUpperCase())) {
                if (obj['isValue']) {
                    var inParam = {
                        ID: -1,
                        queryTypeID: -1,
                        name: replaceBrucket(obj.secondField['value']),
                        domainValueTypeID: item.get('domainValueTypeID')
                    };
                    inParams.push(inParam);
                }
            }
        });

        var obj = {
            queryType: {
                sqlText: SQL,
                ID: -1
            },
            queryInParameters: inParams,
            queryOutParameters: outParams
        };
        return obj;
    },

    /**
     * Функция сохранения запроса
     */
    onSave: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=columnsGrid]');
        var dictsGrid = win.down('gridpanel[name=dataTablesGrid]');
        var condGrid = win.down('gridpanel[name=conditionsGrid]');

        // объект запроса
        var obj = this.getObject(win);
        if (fieldsGrid.getStore().getCount() == 0) {
            var error = 'Задайте хотя бы одно поле, выбираемое запросом.';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
            return;
        }
        if (dictsGrid.getStore().getCount() == 0) {
            var error = 'Задайте хотя бы один источник данных.';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
            return;
        }

        win.body.mask('Сохранение...');
        // AJAX запрос на сохранение
        Ext.Ajax.request({
            url: 'QueryEditor/SaveQueryType',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            jsonData: {
                queryType: obj.queryType,
                queryInParameters: obj.queryInParameters,
                queryOutParameters: obj.queryOutParameters
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                win.body.unmask();
                if (jsonResp.Code == 0) {
                    // Сгененировать событие, сообщающее основной форме о том,
                    // что запрос сохранен
                    win.fireEvent('QuerySaved', win, jsonResp.resultID);
                    _this.onClose(btn);
                } else {
                    WebSystemsBuilder.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                WebSystemsBuilder.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    //region Data table (FROM)

    /**
     * Add new data table for query
     * @param btn Button "Add Data Table "
     */
    onAddDataTable: function (btn) {
        var win = btn.up('window');
        var dataTableGrid = win.down('gridpanel[name=dataTablesGrid]');
        var currentDataTables = dataTableGrid.getStore().data.items;
        var isEdit = currentDataTables != null && currentDataTables.length > 0;

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionDataTable');
        var dataTableWin = WebSystemsBuilder.utils.Windows.open('QueryActionDataTable', {
            queryDataTables: currentDataTables
        }, null, true);
        dataTableWin.on('QueryFromIsReadyToSave', function (query) {
            var newTable = {
                Table: query.Table,
                JoinTable: query.JoinTable,
                JoinKind: isEdit ? query.JoinKind : null,
                Condition: query.Condition,
                TableID: query.Table.TableID,
                Name: query.Table.Name,
                PhysicalTable: query.Table.PhysicalTable
            };
            dataTableGrid.getStore().add(newTable);
        });
    },

    /**
     * Delete data table
     * @param btn Button "Delete data table"
     */
    onDeleteDataTable: function (btn) {
        var win = btn.up('window');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');

        var selectedDataTable = dataTablesGrid.getSelectionModel().getSelection()[0];
        if (!selectedDataTable) {
            MessageBox.error('Choose data table to delete.');
            return;
        }

        MessageBox.question('Do you want to delete data table "' + selectedDataTable.get('Name') + '" from current query?',
            function (res) {
                if (res == 'yes') {
                    var TableID = selectedDataTable.get('TableID');
                    var record = dataTablesGrid.getStore().findRecord('TableID', TableID);
                    dataTablesGrid.getStore().remove(record);
                }
            },
            Ext.Msg.YESNO
        );
    },

    //endregion

    //region Column (SELECT)

    /**
     * Add out column to query
     * @param btn Button "Add column"
     */
    onAddColumn: function (btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var currentDataTables = dataTableGrid.getStore().data.items;

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionColumn');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('QueryActionColumn', {
            queryDataTables: currentDataTables
        }, null, true);
        newColumnWin.on('QuerySelectIsReadyToSave', function (query) {
            var newSelect = {
                ID: query.table.field['ID'],
                field: query.table.field['name'],
                columnName: query.table.field['columnName'],
                domainValueTypeID: query.table.field['domainValueTypeID'],
                dictionary: query.table['name'],
                obj: query
            };
            columnsGrid.getStore().add(newSelect);
        }, this, {single: true});
    },

    /**
     * Delete out column from query
     * @param btn Button "Delete column"
     */
    onDeleteColumn: function (btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');

        var selectedColumn = columnsGrid.getSelectionModel().getSelection()[0];
        if (!selectedColumn) {
            MessageBox.error('Choose column to delete');
            return;
        }

        MessageBox.question('Do you want to delete out column "' + selectedColumn.get('Name') + '" from current query?',
            function (res) {
                if (res == 'yes') {
                    var ColumnID = selectedColumn.get('ColumnID');
                    var record = columnsGrid.getStore().findRecord('ColumnID', ColumnID);
                    columnsGrid.getStore().remove(record);
                }
            },
            Ext.Msg.YESNO
        );
    },

    //endregion

    //region Condition (WHERE)

    /**
     * Функция добавления условия
     * @param btn Кнопка "Добавить"
     */
    onAddCondition: function (btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var condGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryInParametersGrid = win.down('gridpanel[name=queryInParametersGrid]');
        var currentDataTables = dataTablesGrid.getStore().getRange();

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionCondition');
        var queryActionConditionWin = WebSystemsBuilder.utils.Windows.open('QueryActionCondition', {
            queryDataTables: currentDataTables
        }, null, true);
        queryActionConditionWin.on('QueryActionConditionSaved', function (query) {
            var newWhere = {
                ID: query['ID'],
                operation: btn.operation,
                condition: query['conditionStr'],
                domainValueTypeID: query.firstField.field['domainValueTypeID'],
                obj: query
            };
            condGrid.getStore().add(newWhere);
        });
    },

    /**
     * Функция удаления условия
     * @param btn Кнопка "Удалить"
     */
    onDeleteCondition: function (btn) {
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=columnsGrid]');
        var dictsGrid = win.down('gridpanel[name=dataTablesGrid]');
        var condGrid = win.down('gridpanel[name=conditionsGrid]');
        var selection = condGrid.getSelectionModel().getSelection()[0];
        if (!selection) {
            var error = 'Выберите условие для удаления.';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
        } else {
            var ID = selection.get('ID');
            var record = condGrid.getStore().findRecord('ID', ID);
            condGrid.getStore().remove(record);
        }
    },

    //endregion

    //region Query in parameters

    /**
     * Add in parameter to query
     * @param btn
     */
    onAddQueryInParameter: function(btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var queryInParametersGrid = win.down('gridpanel[name=queryInParametersGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OperandExplorer');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('OperandExplorer');
        newColumnWin.on('OperandChosen', function (operand) {
            var newParameter = {
                Name: operand.Value
            };
            queryInParametersGrid.getStore().add(newParameter);
        }, this, {single: true});
    },

    /**
     * Delete data table
     * @param btn Button "Delete data table"
     */
    onDeleteQueryInParameter: function (btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var queryInParametersGrid = win.down('gridpanel[name=queryInParametersGrid]');
        var selectedQueryInParameter = queryInParametersGrid.getSelectionModel().getSelection()[0];

        if (!selectedQueryInParameter) {
            MessageBox.error('Choose query in parameter to delete.');
            return;
        }

        MessageBox.question('Do you want to delete query in parameter "' + selectedQueryInParameter.get('Name') + '" from current query?',
            function (res) {
                if (res == 'yes') {
                    var Name = selectedQueryInParameter.get('Name');
                    var record = queryInParametersGrid.getStore().findRecord('Name', Name);
                    queryInParametersGrid.getStore().remove(record);
                }
            },
            Ext.Msg.YESNO
        );
    },

    //endregion

    /**
     * Обновить текстовое поле с SQL
     * @param btn Кнопка "Обновить"
     */
    onRefreshSQL: function (btn) {
        var win = btn.up('window');
        var _this = this;
        var queryString = win.down('textareafield[name=queryString]');
        var SQL = _this.getQuery(btn);
        queryString.setValue(SQL);
    },

    /**
     * Функция получения выборки SQL
     * @param btn Кнопка формы
     * @returns {string} выборка SQL
     */
    getQuery: function (btn) {
        var win = btn.up('window');
        var fieldsGrid = win.down('gridpanel[name=columnsGrid]');
        var dictsGrid = win.down('gridpanel[name=dataTablesGrid]');
        var condGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryString = win.down('textareafield[name=queryString]');

        var select = '', from = '', where = '';

        fieldsGrid.getStore().data.items.forEach(function (item) {
            var obj = item.get('obj');
            select += select == '' ? '' : ', ';
            select += obj.table['tableName'] + '.' + obj.table.field['columnName'];
        });
        select = 'SELECT ' + select + '\n';

        dictsGrid.getStore().data.items.forEach(function (item) {
            var obj = item.get('obj');
            var str = '';
            // если идет join
            if (obj.anotherTable['tableName']) {
                str += 'LEFT JOIN ' + obj.table['tableName'] + ' on ';
                str += obj.table['tableName'] + '.' + obj.table.field['columnName'] + ' = ';
                str += obj.anotherTable['tableName'] + '.' + obj.anotherTable.field['columnName'];
            } else {
                str += obj.table['tableName'];
            }
            from += str + '\n';
        });
        from = 'FROM ' + from;

        // where
        condGrid.getStore().data.items.forEach(function (item) {
            var obj = item.get('obj');
            var str = item.get('operation') ? (item.get('operation') + ' ') : '';
            str += obj.firstField.table['tableName'] + '.' + obj.firstField.field['columnName'];
            str += ' ' + obj['condition'].toUpperCase();
            // если не is null || is not null
            if (!Ext.Array.contains(['IS NULL', 'IS NOT NULL'], (obj['condition'] || '').trim().toUpperCase())) {
                if (obj['isValue']) {
                    str += ' ' + obj.secondField['value'];
                } else {
                    str += ' ' + obj.secondField.table['tableName'] + '.' + obj.secondField.field['columnName'];
                }
            }
            where += str + '\n';
        });
        where = 'WHERE 1=1 ' + where;

        return select + from + where;
    },

    /**
     * Close the form (button click)
     * @param btn Button "Close"
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});
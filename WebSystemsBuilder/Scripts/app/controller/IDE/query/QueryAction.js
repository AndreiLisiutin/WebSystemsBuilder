Ext.define('WebSystemsBuilder.controller.IDE.query.QueryAction', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.query.QueryAction'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.query.QueryAction',
        'WebSystemsBuilder.model.IDE.query.QueryActionDataTable'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.query.QueryAction',
        'WebSystemsBuilder.store.IDE.query.QueryActionDataTable'
    ],

    init: function () {
        this.control({
            'QueryAction': {
                afterrender: this.onLoad
            },
            // Choose sql type: SELECT/INSERT/UPDATE/DELETE
            'QueryAction radiogroup[name=rgSqlType]': {
                change: this.onChangeSqlType
            },
            'QueryAction button[action=onRefreshSQL]': {
                click: this.onRefreshSqlString
            },
            'QueryAction button[action=onSave]': {
                click: this.onSave
            },
            'QueryAction button[action=onClose]': {
                click: this.onClose
            },

            // Column section (SELECT)
            'QueryAction button[action=onAddColumn]': {
                click: this.onAddColumn
            },
            'QueryAction button[action=onDeleteField]': {
                click: this.onDeleteColumn
            },
            // Data table section (FROM)
            'QueryAction button[action=onAddDataTable]': {
                click: this.onAddDataTable
            },
            'QueryAction button[action=onDeleteDictionary]': {
                click: this.onDeleteDataTable
            },
            // Conditions section (WHERE)
            'QueryAction button[action=onAddConditionAnd], button[action=onAddConditionOr]': {
                click: this.onAddCondition
            },
            'QueryAction button[action=onDeleteCondition]': {
                click: this.onDeleteCondition
            },

            // Query Parameters
            'QueryAction button[action=onAddQueryInParameter]': {
                click: this.onAddQueryInParameter
            },
            'QueryAction button[action=onDeleteQueryInParameter]': {
                click: this.onDeleteQueryInParameter
            },

            // INSERT
            'QueryAction combobox[name=insertDataTable]': {
                change: this.onChangeInsertDataTable
            },
            'QueryAction button[action=onInsert_EditColumnValue]': {
                click: this.onInsert_EditColumnValue
            },
            'QueryAction button[action=onInsert_DeleteColumnValue]': {
                click: this.onInsert_DeleteColumnValue
            },
            'QueryAction button[action=onSetUpdateCondition]': {
                click: this.onSetUpdateCondition
            },

            // DELETE
            'QueryAction combobox[name=deleteDataTable]': {
                change: this.onChangeDeleteDataTable
            },
            'QueryAction button[action=onDelete_AddColumnCondition]': {
                click: this.onDelete_AddColumnCondition
            },
            'QueryAction button[action=onDelete_DeleteColumnCondition]': {
                click: this.onDelete_DeleteColumnCondition
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win Window QueryAction
     */
    onLoad: function (win) {
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var conditionsGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryString = win.down('textareafield[name=queryString]');
        var btnSave = win.down('button[action=onSave]');
        var btnRefresh = win.down('button[action=onRefreshSQL]');
        var rgSqlType = win.down('radiogroup[name=rgSqlType]');
        // INSERT
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('combobox[gridpanel=insertTableColumnsGrid]');
        // DELETE
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('combobox[gridpanel=deleteTableColumnsGrid]');

        var loadInsertDataTable = function () {
            CommonUtils.safeMask(insertDataTable);
            insertDataTable.getStore().load({
                callback: function () {
                    CommonUtils.safeUnmask(insertDataTable);
                }
            });
        };
        var loadDeleteDataTable = function () {
            CommonUtils.safeMask(deleteDataTable);
            deleteDataTable.getStore().load({
                callback: function () {
                    CommonUtils.safeUnmask(deleteDataTable);
                }
            });
        };

        rgSqlType.setValue({'data': 'SELECT'});

        // INSERT
        loadInsertDataTable();
        // DELETE
        loadDeleteDataTable();
    },

    //region INSERT

    /**
     * Change data table -> show all columns
     * @param combo
     */
    onChangeInsertDataTable: function (combo) {
        var win = combo.up('window');
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('gridpanel[name=insertTableColumnsGrid]');

        if (!insertDataTable.getValue()) {
            insertTableColumnsGrid.getStore().loadData([]);
            return;
        }

        var tableID = insertDataTable.getValue();
        insertTableColumnsGrid.getStore().load({
            params: {
                tableID: tableID + ''
            }
        });
    },

    /**
     * Edit column value (INSERT operation)
     * @param btn
     */
    onInsert_EditColumnValue: function (btn) {
        var win = btn.up('window');
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('gridpanel[name=insertTableColumnsGrid]');

        var selectedInsertColumn = insertTableColumnsGrid.getSelectionModel().getSelection()[0];
        if (!selectedInsertColumn) {
            MessageBox.error('Choose column to set insert value');
            return;
        }

        var currentValue = selectedInsertColumn.get('Value');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OperandExplorer');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('OperandExplorer');
        newColumnWin.on('OperandChosen', function (operand) {
            var setValue = function () {
                selectedInsertColumn.set('Value', operand);
                selectedInsertColumn.commit();
            };
            if (currentValue) {
                MessageBox.question('Do you want to change insert value for column "' + selectedInsertColumn.get('Name') + '"?',
                    function (res) {
                        if (res == 'yes') {
                            setValue();
                        }
                    },
                    Ext.Msg.YESNO
                );
            } else {
                setValue();
            }
        }, this, {single: true});
    },

    /**
     * Delete column value/set default value (INSERT operation)
     * @param btn
     */
    onInsert_DeleteColumnValue: function (btn) {
        var win = btn.up('window');
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('gridpanel[name=insertTableColumnsGrid]');

        var selectedInsertColumn = insertTableColumnsGrid.getSelectionModel().getSelection()[0];
        if (!selectedInsertColumn) {
            MessageBox.error('Choose column to set default insert value');
            return;
        }

        MessageBox.question('Do you want to set default insert value for column "' + selectedInsertColumn.get('Name') + '"?',
            function (res) {
                if (res == 'yes') {
                    selectedInsertColumn.set('Value', null);
                    selectedInsertColumn.commit();
                }
            },
            Ext.Msg.YESNO
        );
    },

    /**
     * Set UPDATE operation condition
     * @param btn
     */
    onSetUpdateCondition: function (btn) {
        var win = btn.up('window');
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('gridpanel[name=insertTableColumnsGrid]');
        var updateCondition = win.down('textfield[gridpanel=updateCondition]');

        if (!insertDataTable.getValue()) {
            MessageBox.error('Choose data table');
            return;
        }

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionCondition');
        var updateConditionWin = WebSystemsBuilder.utils.Windows.open('QueryActionCondition', {
            FirstTableID: insertDataTable.getValue(),
            SecondTableID: insertDataTable.getValue()
        });
        updateConditionWin.on('OperandChosen', function (condition) {
            updateCondition.conditionObj = condition;
            updateCondition.setValue(condition.Condition);
        }, this, {single: true});
    },

    /**
     * Generate INSERT SQL query
     * @param btn
     * @returns {string}
     */
    onGenerateInsertQuery: function (btn) {
        var win = btn.up('window');
        var queryString = win.down('textareafield[name=queryString]');
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('combobox[gridpanel=insertTableColumnsGrid]');
        var rgSqlType = win.down('radiogroup[name=rgSqlType]');
        var isInsert = rgSqlType.getValue().data == 'INSERT';

        if (!insertDataTable.getValue()) {
            MessageBox.error('Choose data table');
            return '';
        }
        var dataTable = insertDataTable.getRawValue();

        // INSERT columns string
        var columnsList = [];
        var valuesList = [];
        insertTableColumnsGrid.getStore().getRange().forEach(function (currentColumn) {
            var column = currentColumn.get('Name');
            var value = currentColumn.get('Value');
            if (value) {
                columnsList.push(column);
                valuesList.push(value);
            }
        });
        if (columnsList.length == 0) {
            MessageBox.error('Set insert value to columns');
            return '';
        }
        // Column names
        var selectString = isInsert ? 'INSERT INTO' : 'UPDATE';
        selectString += ' ' + dataTable + ' (' + columnsList.join(', ') + ') \n';
        // Column values
        selectString += isInsert ? 'VALUES' : '=';
        selectString += ' (' + valuesList.join(', ') + ')';

        // Full query string
        return selectString;
    },

    //endregion

    //region DELETE

    /**
     * Change data table -> show all columns
     * @param combo
     */
    onChangeDeleteDataTable: function (combo) {
        var win = combo.up('window');
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('combobox[gridpanel=deleteTableColumnsGrid]');

        if (!deleteDataTable.getValue()) {
            deleteTableColumnsGrid.getStore().loadData([]);
            return;
        }

        var tableID = deleteDataTable.getValue();
        deleteTableColumnsGrid.getStore().load({
            params: {
                tableID: tableID + ''
            }
        });
    },

    /**
     * Edit column value (DELETE operation)
     * @param btn
     */
    onDelete_AddColumnCondition: function (btn) {
        var win = btn.up('window');
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('combobox[gridpanel=deleteTableColumnsGrid]');

        var selectedDeleteColumn = deleteTableColumnsGrid.getSelectionModel().getSelection()[0];
        if (!selectedDeleteColumn) {
            MessageBox.error('Choose column to set delete condition');
            return;
        }

        var currentValue = selectedDeleteColumn.get('Value');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionCondition');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('QueryActionCondition', {
            FirstTableID: deleteDataTable.getValue(),
            SecondTableID: deleteDataTable.getValue()
        });
        newColumnWin.on('OperandChosen', function (operand) {
            var setValue = function () {
                selectedDeleteColumn.set('Value', operand);
                selectedDeleteColumn.commit();
            };
            if (currentValue) {
                MessageBox.question('Do you want to change delete condition for column "' + selectedDeleteColumn.get('Name') + '"?',
                    function (res) {
                        if (res == 'yes') {
                            setValue();
                        }
                    },
                    Ext.Msg.YESNO
                );
            } else {
                setValue();
            }
        }, this, {single: true});
    },

    /**
     * Delete column condition (DELETE operation)
     * @param btn
     */
    onDelete_DeleteColumnCondition: function (btn) {
        var win = btn.up('window');
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('combobox[gridpanel=deleteTableColumnsGrid]');

        var selectedDeleteColumn = deleteTableColumnsGrid.getSelectionModel().getSelection()[0];
        if (!selectedDeleteColumn) {
            MessageBox.error('Choose column to add DELETE condition');
            return;
        }

        MessageBox.question('Do you want to replace DELETE condition "' + selectedDeleteColumn.get('Name') + '"?',
            function (res) {
                if (res == 'yes') {
                    selectedDeleteColumn.set('Value', null);
                    selectedDeleteColumn.commit();
                }
            },
            Ext.Msg.YESNO
        );
    },

    /**
     * Generate DELETE SQL query
     * @param btn
     * @returns {string}
     */
    onGenerateDeleteQuery: function (btn) {
        var win = btn.up('window');
        var queryString = win.down('textareafield[name=queryString]');
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('combobox[gridpanel=deleteTableColumnsGrid]');

        if (!deleteDataTable.getValue()) {
            MessageBox.error('Choose data table');
            return '';
        }
        var dataTable = deleteDataTable.getRawValue();

        // INSERT columns string
        var conditionList = [];
        deleteTableColumnsGrid.getStore().getRange().forEach(function (currentColumn) {
            var condition = currentColumn.get('Value');
            if (condition) {
                conditionList.push(condition);
            }
        });

        // Column names
        var selectString = 'DELETE FROM ' + dataTable;
        if (conditionList.length > 0) {
            selectString += ' WHERE ' + conditionList.join('\nAND ');
        }

        // Full query string
        return selectString;
    },

    //endregion

    //region SELECT

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
        var dataTableGrid = win.down('gridpanel[name=dataTablesGrid]');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var currentDataTables = dataTableGrid.getStore().data.items;

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionColumn');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('QueryActionColumn', {
            queryDataTables: currentDataTables
        }, null, true);
        newColumnWin.on('QuerySelectIsReadyToSave', function (column) {
            var newColumn = {
                Table: column.Table,
                Column: column.Column,
                Name: column.Column.Name,
                TableName: column.Table.Name
            };
            columnsGrid.getStore().add(newColumn);
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
        var conditionsGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryInParametersGrid = win.down('gridpanel[name=queryInParametersGrid]');
        var currentDataTables = dataTablesGrid.getStore().getRange();

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionCondition');
        var queryActionConditionWin = WebSystemsBuilder.utils.Windows.open('QueryActionCondition', {
            queryDataTables: currentDataTables
        }, null, true);
        queryActionConditionWin.on('QueryActionConditionSaved', function (condition) {
            var newCondition = {
                UniqueID: condition.UniqueID,
                FirstPart: condition.FirstPart,
                SecondPart: condition.SecondPart,
                ConditionSign: condition.ConditionSign,
                ConditionString: condition.ConditionString,
                Operation: btn.operation // AND/OR
            };
            conditionsGrid.getStore().add(newCondition);
        });
    },

    /**
     * Функция удаления условия
     * @param btn Кнопка "Удалить"
     */
    onDeleteCondition: function (btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var conditionsGrid = win.down('gridpanel[name=conditionsGrid]');

        var selection = conditionsGrid.getSelectionModel().getSelection()[0];
        if (!selection) {
            MessageBox.error('Выберите условие для удаления.');
            return;
        }

        var UniqueID = selection.get('UniqueID');
        var record = conditionsGrid.getStore().findRecord('UniqueID', UniqueID);
        conditionsGrid.getStore().remove(record);
    },

    //endregion

    /**
     * Receive SELECT SQL query
     * @param btn
     * @returns {string}
     */
    onGenerateSelectQuery: function (btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesList = win.down('gridpanel[name=dataTablesGrid]');
        var conditionsGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryString = win.down('textareafield[name=queryString]');

        // SELECT string
        var columnsList = [];
        columnsGrid.getStore().getRange().forEach(function (currentColumn) {
            var table = currentColumn.get('Table');
            var column = currentColumn.get('Column');
            columnsList.push(table.Name + '.' + column.Name);
        });
        if (columnsList.length == 0) {
            MessageBox.error('Choose any out column');
            return;
        }
        var selectString = 'SELECT ' + columnsList.join(', ') + '\n';

        // FROM string
        var fromString = '';
        if (dataTablesList.getStore().getRange() == 0) {
            MessageBox.error('Choose any data table');
            return;
        }
        dataTablesList.getStore().getRange().forEach(function (currentTable) {
            var table = currentTable.get('Table');
            var joinTable = currentTable.get('JoinTable');
            var joinKind = currentTable.get('JoinKind');
            var condition = currentTable.get('Condition');

            if (!joinTable || !joinTable.TableID) {
                fromString += 'FROM ' + table.Name + '\n';
            } else {
                fromString += (joinKind.Name || 'LEFT') + ' JOIN ' + table.Name + ' ON ' + condition + '\n';
            }
        });

        // WHERE string
        var conditionsList = [];
        conditionsGrid.getStore().data.items.forEach(function (item) {
            var condition = item.get('ConditionString') + '\n';
            conditionsList.push(condition);
        });
        var whereString = '';
        if (conditionsList.length > 0) {
            whereString = 'WHERE ' + conditionsList.join(' AND ');
        }

        // Full query string
        return selectString + fromString + whereString;
    },

    //endregion

    //region Query in parameters

    /**
     * Add in parameter to query
     * @param btn
     */
    onAddQueryInParameter: function (btn) {
        var win = btn.up('window');
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var queryInParametersGrid = win.down('gridpanel[name=queryInParametersGrid]');

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OperandExplorer');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('OperandExplorer', {
            hideControl: true
        });
        newColumnWin.on('OperandChosen', function (operand) {
            queryInParametersGrid.getStore().add(operand);
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
     * Change sql type
     * @param radioGroup
     */
    onChangeSqlType: function (radioGroup) {
        var win = radioGroup.up('window');
        var rgSqlType = win.down('radiogroup[name=rgSqlType]');
        var sqlActionTabPanel = win.down('tabpanel[name=sqlActionTabPanel]');
        var selectPanel = win.down('panel[name=selectSqlAction]');
        var insertPanel = win.down('panel[name=insertSqlAction]');
        var deletePanel = win.down('panel[name=deleteSqlAction]');
        var updateConditionContainer = win.down('container[name=updateConditionContainer]');

        if (rgSqlType.getValue()) {
            switch (rgSqlType.getValue().data) {
                case 'SELECT':
                    sqlActionTabPanel.setActiveTab(selectPanel);
                    selectPanel.setDisabled(false);
                    insertPanel.setDisabled(true);
                    deletePanel.setDisabled(true);
                    break;
                case 'INSERT':
                    updateConditionContainer.hide();
                    sqlActionTabPanel.setActiveTab(insertPanel);
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(false);
                    deletePanel.setDisabled(true);
                    break;
                case 'UPDATE':
                    updateConditionContainer.show();
                    sqlActionTabPanel.setActiveTab(insertPanel);
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(false);
                    deletePanel.setDisabled(true);
                    break;
                case 'DELETE':
                    sqlActionTabPanel.setActiveTab(deletePanel);
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(true);
                    deletePanel.setDisabled(false);
                    break;
                default:
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(true);
                    deletePanel.setDisabled(true);
                    break;
            }
        } else {
            selectPanel.setDisabled(true);
            insertPanel.setDisabled(true);
            deletePanel.setDisabled(true);
        }
    },

    /**
     * Get object to save the query
     * @param win Window
     */
    getObject: function (win) {
        var _this = this;
        var fieldsGrid = win.down('gridpanel[name=columnsGrid]');
        var dictsGrid = win.down('gridpanel[name=dataTablesGrid]');
        var condGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryString = win.down('textareafield[name=queryString]');
        var SQL = _this.onGenerateSelectQuery(win.down('button'));
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
     * Save the query
     * @param btn Button "Save"
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

    /**
     * Generate SQL query by meta-descriptions
     * @param btn Кнопка "Обновить"
     */
    onRefreshSqlString: function (btn) {
        var win = btn.up('window');
        var _this = this;
        var queryString = win.down('textareafield[name=queryString]');
        var rgSqlType = win.down('radiogroup[name=rgSqlType]');

        var sqlString = '';
        if (rgSqlType.getValue()) {
            switch (rgSqlType.getValue().data) {
                case 'SELECT':
                    // Get sql string from SELECT tables
                    sqlString = _this.onGenerateSelectQuery(btn);
                    break;
                case 'INSERT':
                case 'UPDATE':
                    // Get sql string from INSERT tables
                    sqlString = _this.onGenerateInsertQuery(btn);
                    break;
                case 'DELETE':
                    // Get sql string from DELETE tables
                    sqlString = _this.onGenerateDeleteQuery(btn);
                    break;
            }
        }

        // Display sql string
        queryString.setValue(sqlString);
    },

    /**
     * Close the form (button click)
     * @param btn Button "Close"
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});
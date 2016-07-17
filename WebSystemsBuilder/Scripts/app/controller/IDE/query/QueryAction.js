Ext.define('WebSystemsBuilder.controller.IDE.query.QueryAction', {
    extend: 'Ext.app.Controller',

    requires: [
        'WebSystemsBuilder.utils.IDE.QueryInParametersIDE'
    ],
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
            'QueryAction button[action=onDeleteColumn]': {
                click: this.onDeleteColumn
            },
            // Data table section (FROM)
            'QueryAction button[action=onAddDataTable]': {
                click: this.onAddDataTable
            },
            'QueryAction button[action=onDeleteDataTable]': {
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
        var queryInParametersGrid = win.down('gridpanel[name=queryInParametersGrid]');
        // INSERT
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('gridpanel[name=insertTableColumnsGrid]');
        // DELETE
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('gridpanel[name=deleteTableColumnsGrid]');

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

        win.QueryInParametersIDE = Ext.create('WebSystemsBuilder.utils.IDE.QueryInParametersIDE');
        win.QueryInParametersIDE.init(queryInParametersGrid);

        rgSqlType.setValue({'sqlTypeRadioGroup': 'SELECT'});

        // INSERT
        loadInsertDataTable();
        // DELETE
        loadDeleteDataTable();
    },

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
            switch (rgSqlType.getValue().sqlTypeRadioGroup) {
                case 'SELECT':
                    sqlActionTabPanel.setActiveTab(selectPanel);
                    selectPanel.setDisabled(false);
                    insertPanel.setDisabled(true);
                    deletePanel.setDisabled(true);
                    win.QueryInParametersIDE.setQueryType(1);
                    break;
                case 'INSERT':
                    updateConditionContainer.hide();
                    sqlActionTabPanel.setActiveTab(insertPanel);
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(false);
                    deletePanel.setDisabled(true);
                    win.QueryInParametersIDE.setQueryType(2);
                    break;
                case 'UPDATE':
                    updateConditionContainer.show();
                    sqlActionTabPanel.setActiveTab(insertPanel);
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(false);
                    deletePanel.setDisabled(true);
                    win.QueryInParametersIDE.setQueryType(2);
                    break;
                case 'DELETE':
                    sqlActionTabPanel.setActiveTab(deletePanel);
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(true);
                    deletePanel.setDisabled(false);
                    win.QueryInParametersIDE.setQueryType(3);
                    break;
                default:
                    selectPanel.setDisabled(true);
                    insertPanel.setDisabled(true);
                    deletePanel.setDisabled(true);
                    win.QueryInParametersIDE.setQueryType(1);
                    break;
            }
        } else {
            selectPanel.setDisabled(true);
            insertPanel.setDisabled(true);
            deletePanel.setDisabled(true);
            win.QueryInParametersIDE.setQueryType(1);
        }
    },

    /**
     * Receive SQL string
     * @param win
     * @returns {string}
     */
    getSqlString: function (win) {
        var _this = this;
        var rgSqlType = win.down('radiogroup[name=rgSqlType]');

        var sqlString = '';
        if (rgSqlType.getValue()) {
            switch (rgSqlType.getValue().sqlTypeRadioGroup) {
                case 'SELECT':
                    // Get sql string from SELECT tables
                    sqlString = _this.onGenerateSelectQuery(win);
                    break;
                case 'INSERT':
                case 'UPDATE':
                    // Get sql string from INSERT tables
                    sqlString = _this.onGenerateInsertQuery(win);
                    break;
                case 'DELETE':
                    // Get sql string from DELETE tables
                    sqlString = _this.onGenerateDeleteQuery(win);
                    break;
            }
        }

        return sqlString;
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

        var sqlString = _this.getSqlString(win);

        // Display sql string
        queryString.setValue(sqlString);
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

        var currentValue = selectedInsertColumn.get('OperandValue');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.OperandExplorer');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('OperandExplorer', {
            hideConstant: false
        });
        newColumnWin.on('OperandChosen', function (operand) {
            var setValue = function () {
                selectedInsertColumn.set('OperandValue', operand);
                selectedInsertColumn.commit();
                insertTableColumnsGrid.getView().refresh();

                if (operand.IsControl || operand.IsFormParameter) {
                    operand.Parameter.QueryTypeID = 2;
                    win.QueryInParametersIDE.addParameter(operand.Parameter);
                }
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
                    var currentOperandValue = selectedInsertColumn.get('OperandValue');
                    if (currentOperandValue && (currentOperandValue.IsControl || currentOperandValue.IsFormParameter)) {
                        var uniqueID = currentOperandValue.IsControl ? currentOperandValue.Control.UniqueID : currentOperandValue.FormParameter.UniqueID;
                        win.QueryInParametersIDE.deleteParameter(uniqueID, 2);
                    }

                    selectedInsertColumn.set('OperandValue', null);
                    selectedInsertColumn.commit();
                    insertTableColumnsGrid.getView().refresh();
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
        var updateCondition = win.down('textfield[name=updateCondition]');

        if (!insertDataTable.getValue()) {
            MessageBox.error('Choose data table');
            return;
        }

        var physicalTable = insertDataTable.getStore().findRecord('TableID', insertDataTable.getValue()).get('PhysicalTable');
        var dataTableList = [
            {
                Table: {
                    TableID: insertDataTable.getValue(),
                    Name: insertDataTable.getRawValue(),
                    PhysicalTable: physicalTable
                },
                TableID: insertDataTable.getValue(),
                Name: insertDataTable.getRawValue(),
                PhysicalTable: physicalTable
            }
        ];

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionCondition');
        var updateConditionWin = WebSystemsBuilder.utils.Windows.open('QueryActionCondition', {
            queryDataTables: dataTableList,
            FirstTableID: insertDataTable.getValue(),
            SecondTableID: insertDataTable.getValue()
        });
        updateConditionWin.on('QueryActionConditionSaved', function (condition) {
            if (condition.SecondPart.IsFormControl || condition.SecondPart.IsFormParameter) {
                condition.Parameter.QueryTypeID = 2;
                win.QueryInParametersIDE.addParameter(condition.Parameter);
            }
            updateCondition.conditionObj = condition;
            updateCondition.setValue(condition.ConditionString);
        }, this, {single: true});
    },

    /**
     * Generate INSERT SQL query
     * @param win
     * @returns {string}
     */
    onGenerateInsertQuery: function (win) {
        var queryString = win.down('textareafield[name=queryString]');
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('gridpanel[name=insertTableColumnsGrid]');
        var rgSqlType = win.down('radiogroup[name=rgSqlType]');
        var updateCondition = win.down('textfield[name=updateCondition]');
        var isInsert = rgSqlType.getValue().sqlTypeRadioGroup == 'INSERT';

        if (!insertDataTable.getValue()) {
            MessageBox.error('Choose data table');
            return '';
        }
        var physicalTable = deleteDataTable.findRecordByValue(deleteDataTable.getValue()).get('PhysicalTable');
        var dataTablePlaceHolder = '{' + physicalTable + '}';

        // INSERT columns string
        var columnsList = [];
        var valuesList = [];
        insertTableColumnsGrid.getStore().getRange().forEach(function (currentColumn) {
            var column = currentColumn.get('PlaceHolder');
            var value = currentColumn.get('OperandValue');
            if (value) {
                columnsList.push(column);
                valuesList.push(value.PlaceHolder);
            }
        });
        if (columnsList.length == 0) {
            MessageBox.error('Set insert value to columns');
            return '';
        }
        // Column names
        var selectString = isInsert ? 'INSERT INTO' : 'UPDATE';
        selectString += ' ' + dataTablePlaceHolder + ' (' + columnsList.join(', ') + ') \n';
        // Column values
        selectString += isInsert ? 'VALUES' : '=';
        selectString += ' (' + valuesList.join(', ') + ')';

        if (!isInsert) {
            if (updateCondition.getValue()) {
                selectString += '\n' + 'WHERE ' + updateCondition.getValue();
            }
        }

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
        var deleteTableColumnsGrid = win.down('gridpanel[name=deleteTableColumnsGrid]');

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
        var deleteTableColumnsGrid = win.down('gridpanel[name=deleteTableColumnsGrid]');

        var selectedDeleteColumn = deleteTableColumnsGrid.getSelectionModel().getSelection()[0];
        if (!selectedDeleteColumn) {
            MessageBox.error('Choose column to set delete condition');
            return;
        }

        var physicalTable = deleteDataTable.getStore().findRecord('TableID', deleteDataTable.getValue()).get('PhysicalTable');
        var dataTableList = [
            {
                Table: {
                    TableID: deleteDataTable.getValue(),
                    Name: deleteDataTable.getRawValue(),
                    PhysicalTable: physicalTable
                },
                TableID: deleteDataTable.getValue(),
                Name: deleteDataTable.getRawValue(),
                PhysicalTable: physicalTable
            }
        ];

        var currentValue = selectedDeleteColumn.get('OperandValue');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.QueryActionCondition');
        var newColumnWin = WebSystemsBuilder.utils.Windows.open('QueryActionCondition', {
            queryDataTables: dataTableList,
            FirstTableID: deleteDataTable.getValue(),
            FirstColumnID: selectedDeleteColumn.get('ColumnID'),
            SecondTableID: deleteDataTable.getValue()
        });
        newColumnWin.on('QueryActionConditionSaved', function (condition) {
            var setValue = function () {
                if (condition.SecondPart.IsFormControl || condition.SecondPart.IsFormParameter) {
                    condition.Parameter.QueryTypeID = 3;
                    win.QueryInParametersIDE.addParameter(condition.Parameter);
                }
                selectedDeleteColumn.set('OperandValue', condition);
                selectedDeleteColumn.commit();
                deleteTableColumnsGrid.getView().refresh();
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
        var deleteTableColumnsGrid = win.down('gridpanel[name=deleteTableColumnsGrid]');

        var selectedDeleteColumn = deleteTableColumnsGrid.getSelectionModel().getSelection()[0];
        if (!selectedDeleteColumn) {
            MessageBox.error('Choose column to add DELETE condition');
            return;
        }

        MessageBox.question('Do you want to replace DELETE condition "' + selectedDeleteColumn.get('Name') + '"?',
            function (res) {
                if (res == 'yes') {
                    var currentOperandValue = selectedDeleteColumn.get('OperandValue');
                    if (currentOperandValue && (currentOperandValue.SecondPart.IsFormControl || currentOperandValue.SecondPart.IsFormParameter)) {
                        var uniqueID = currentOperandValue.SecondPart.IsFormControl ? currentOperandValue.SecondPart.FormControl.UniqueID : currentOperandValue.SecondPart.FormParameter.UniqueID;
                        win.QueryInParametersIDE.deleteParameter(uniqueID, 3);
                    }

                    selectedDeleteColumn.set('OperandValue', null);
                    selectedDeleteColumn.commit();
                    deleteTableColumnsGrid.getView().refresh();
                }
            },
            Ext.Msg.YESNO
        );
    },

    /**
     * Generate DELETE SQL query
     * @param win
     * @returns {string}
     */
    onGenerateDeleteQuery: function (win) {
        var queryString = win.down('textareafield[name=queryString]');
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('gridpanel[name=deleteTableColumnsGrid]');

        if (!deleteDataTable.getValue()) {
            MessageBox.error('Choose data table');
            return '';
        }
        var physicalTable = deleteDataTable.findRecordByValue(deleteDataTable.getValue()).get('PhysicalTable');
        var dataTablePlaceHolder = '{' + physicalTable + '}';

        // INSERT columns string
        var conditionList = [];
        deleteTableColumnsGrid.getStore().getRange().forEach(function (currentColumn) {
            var condition = currentColumn.get('OperandValue');
            if (condition) {
                conditionList.push(condition.ConditionString);
            }
        });

        // Column names
        var selectString = 'DELETE FROM ' + dataTablePlaceHolder;
        if (conditionList.length > 0) {
            selectString += '\nWHERE ' + conditionList.join('\nAND ');
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
                Column: column.Column
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
                Parameter: condition.Parameter,
                ConditionSign: condition.ConditionSign,
                ConditionString: condition.ConditionString,
                Operation: btn.operation // AND/OR
            };
            if (condition.SecondPart.IsFormControl || condition.SecondPart.IsFormParameter) {
                condition.Parameter.QueryTypeID = 1;
                win.QueryInParametersIDE.addParameter(condition.Parameter);
            }
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

        var currentOperandValue = selection.get('SecondPart');
        if (currentOperandValue && (currentOperandValue.IsFormControl || currentOperandValue.IsFormParameter)) {
            var uniqueID = currentOperandValue.IsFormControl ? currentOperandValue.FormControl.UniqueID : currentOperandValue.FormParameter.UniqueID;
            win.QueryInParametersIDE.deleteParameter(uniqueID, 1);
        }

        var UniqueID = selection.get('UniqueID');
        var record = conditionsGrid.getStore().findRecord('UniqueID', UniqueID);
        conditionsGrid.getStore().remove(record);
    },

    //endregion

    /**
     * Receive SELECT SQL query
     * @param win
     * @returns {string}
     */
    onGenerateSelectQuery: function (win) {
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesList = win.down('gridpanel[name=dataTablesGrid]');
        var conditionsGrid = win.down('gridpanel[name=conditionsGrid]');
        var queryString = win.down('textareafield[name=queryString]');

        // SELECT string
        var columnsList = [];
        columnsGrid.getStore().getRange().forEach(function (currentColumn) {
            var table = currentColumn.get('Table');
            var column = currentColumn.get('Column');
            columnsList.push(table.PlaceHolder + '.' + column.PlaceHolder);
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
                fromString += 'FROM ' + table.PlaceHolder + '\n';
            } else {
                fromString += (joinKind.Name || 'LEFT') + ' JOIN ' + table.PlaceHolder + ' ON ' + condition + '\n';
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
     * Get object to save the query
     * @param win Window
     */
    getQueryObject: function (win) {
        var _this = this;
        var rgSqlType = win.down('radiogroup[name=rgSqlType]');
        var queryInParametersGrid = win.down('gridpanel[name=queryInParametersGrid]');
        var queryString = win.down('textareafield[name=queryString]');
        // SELECT
        var columnsGrid = win.down('gridpanel[name=columnsGrid]');
        var dataTablesGrid = win.down('gridpanel[name=dataTablesGrid]');
        var conditionsGrid = win.down('gridpanel[name=conditionsGrid]');
        // INSERT
        var insertDataTable = win.down('combobox[name=insertDataTable]');
        var insertTableColumnsGrid = win.down('gridpanel[name=insertTableColumnsGrid]');
        var updateCondition = win.down('textfield[name=updateCondition]');
        // DELETE
        var deleteDataTable = win.down('combobox[name=deleteDataTable]');
        var deleteTableColumnsGrid = win.down('gridpanel[name=deleteTableColumnsGrid]');

        var sqlString = _this.getSqlString(win);
        if (!sqlString) {
            MessageBox.error('Generate SQL string');
            return;
        }

        var queryInParameters = win.QueryInParametersIDE.getQueryInParameters();
        var tablesList = [];
        var columnsList = [];
        var queryOutParameters = [];

        var parseCondition = function (firstPart, secondPart) {
            tablesList.push({
                TableID: firstPart.Table.TableID,
                Name: firstPart.Table.Name,
                QueryTypePlaceholder: '{' + firstPart.Table.PhysicalTable + '}'
            });
            columnsList.push({
                ColumnID: firstPart.Column.ColumnID,
                Name: firstPart.Column.Name,
                QueryTypePlaceholder: '{' + firstPart.Column.PhysicalColumn + '}'
            });
            if (secondPart) {
                if (secondPart.IsColumn && secondPart.Column.ColumnID > 0) {
                    tablesList.push({
                        TableID: secondPart.Table.TableID,
                        Name: secondPart.Table.Name,
                        QueryTypePlaceholder: '{' + secondPart.Table.PhysicalTable + '}'
                    });
                    columnsList.push({
                        ColumnID: secondPart.Column.ColumnID,
                        Name: secondPart.Column.Name,
                        QueryTypePlaceholder: '{' + secondPart.Column.PhysicalColumn + '}'
                    });
                }
            }
        };

        if (rgSqlType.getValue()) {
            switch (rgSqlType.getValue().sqlTypeRadioGroup) {
                case 'SELECT':
                    columnsGrid.getStore().getRange().forEach(function (currentColumn) {
                        var column = currentColumn.get('Column');
                        columnsList.push({
                            ColumnID: column.ColumnID,
                            Name: column.Name,
                            QueryTypePlaceholder: '{' + column.PhysicalColumn + '}'
                        });
                        queryOutParameters.push({
                            Name: column.Name,
                            ValueTypeID: column.ValueTypeID,
                            QueryTypeAlias: column.PhysicalColumn,
                            QueryTypePlaceholder: '{' + column.PhysicalColumn + '}'
                        });
                    });
                    dataTablesGrid.getStore().getRange().forEach(function (currentTable) {
                        var table = currentTable.get('Table');
                        tablesList.push({
                            TableID: table.TableID,
                            Name: table.Name,
                            QueryTypePlaceholder: '{' + table.PhysicalTable + '}'
                        });
                        var joinColumn = table.JoinColumn;
                        if (joinColumn) {
                            columnsList.push({
                                ColumnID: joinColumn.ColumnID,
                                Name: joinColumn.Name,
                                QueryTypePlaceholder: '{' + joinColumn.PhysicalColumn + '}'
                            });
                        }

                        var joinTable = currentTable.get('JoinTable');
                        if (joinTable) {
                            tablesList.push({
                                TableID: joinTable.TableID,
                                Name: joinTable.Name,
                                QueryTypePlaceholder: '{' + joinTable.PhysicalTable + '}'
                            });

                            var joinTableColumn = joinTable.JoinColumn;
                            if (joinColumn) {
                                columnsList.push({
                                    ColumnID: joinTableColumn.ColumnID,
                                    Name: joinTableColumn.Name,
                                    QueryTypePlaceholder: '{' + joinTableColumn.PhysicalColumn + '}'
                                });
                            }
                        }
                    });
                    conditionsGrid.getStore().getRange().forEach(function (currentCondition) {
                        var firstPart = currentCondition.get('FirstPart');
                        var secondPart = currentCondition.get('SecondPart');
                        parseCondition(firstPart, secondPart);
                    });
                    break;
                case 'INSERT':
                    tablesList.push({
                        TableID: insertDataTable.getValue(),
                        Name: insertDataTable.getRawValue(),
                        QueryTypePlaceholder: '{' + insertDataTable.getStore().findRecord('TableID', insertDataTable.getValue()).get('PhysicalTable') + '}'
                    });
                    insertTableColumnsGrid.getStore().getRange().forEach(function (currentColumn) {
                        if (currentColumn.get('OperandValue')) {
                            var queryTypeColumn = {
                                ColumnID: currentColumn.get('ColumnID'),
                                Name: currentColumn.get('Name'),
                                QueryTypePlaceholder: '{' + currentColumn.get('PhysicalColumn') + '}'
                            };
                            columnsList.push(queryTypeColumn);
                        }
                    });
                    break;
                case 'UPDATE':
                    tablesList.push({
                        TableID: insertDataTable.getValue(),
                        Name: insertDataTable.getRawValue(),
                        QueryTypePlaceholder: '{' + insertDataTable.getStore().findRecord('TableID', insertDataTable.getValue()).get('PhysicalTable') + '}'
                    });
                    insertTableColumnsGrid.getStore().getRange().forEach(function (currentColumn) {
                        if (currentColumn.get('OperandValue')) {
                            var queryTypeColumn = {
                                ColumnID: currentColumn.get('ColumnID'),
                                Name: currentColumn.get('Name'),
                                QueryTypePlaceholder: '{' + currentColumn.get('PhysicalColumn') + '}'
                            };
                            columnsList.push(queryTypeColumn);
                        }
                    });
                    if (updateCondition.conditionObj) {
                        var firstPart = updateCondition.conditionObj.FirstPart;
                        var secondPart = updateCondition.conditionObj.SecondPart;
                        parseCondition(firstPart, secondPart);
                    }
                    break;
                case 'DELETE':
                    tablesList.push({
                        TableID: deleteDataTable.getValue(),
                        Name: deleteDataTable.getRawValue(),
                        QueryTypePlaceholder: '{' + deleteDataTable.getStore().findRecord('TableID', deleteDataTable.getValue()).get('PhysicalTable') + '}'
                    });
                    deleteTableColumnsGrid.getStore().getRange().forEach(function (currentColumn) {
                        var condition = currentColumn.get('OperandValue');
                        if (condition) {
                            columnsList.push({
                                ColumnID: currentColumn.get('ColumnID'),
                                Name: currentColumn.get('Name'),
                                QueryTypePlaceholder: '{' + currentColumn.get('PhysicalColumn') + '}'
                            });
                            var firstPart = condition.FirstPart;
                            var secondPart = condition.SecondPart;
                            parseCondition(firstPart, secondPart);
                        }
                    });
                    break;
            }
        }

        // Function to get unique instances of the list using unique property (received from func)
        var getUniqueList = function (list, func) {
            var uniqueList = [];
            var aleradyHasTheSame = function (listInstance) {
                var aleradyHas = false;
                uniqueList.forEach(function (uniqueInstance) {
                    if (func(uniqueInstance) == func(listInstance)) {
                        aleradyHas = true;
                    }
                });
                return aleradyHas;
            };
            list.forEach(function (item) {
                if (!aleradyHasTheSame(item)) {
                    uniqueList.push(item);
                }
            });
            return uniqueList;
        };

        var actionType = WebSystemsBuilder.utils.mapping.ActionTypes.Query;
        var queryAction = {
            UniqueID: RandomIDE.get(),
            EventActionTypeID: actionType,
            EventActionType: ActionTypes.getActionTypeName(actionType),
            ChildActions: [],
            QueryType: {
                UniqueID: RandomIDE.get(),
                Name: '',
                Sql: sqlString
            },
            QueryTypeColumnList: getUniqueList(columnsList, function (i) {
                return i.ColumnID
            }),
            QueryTypeTableList: getUniqueList(tablesList, function (i) {
                return i.TableID
            }),
            QueryTypeInList: getUniqueList(queryInParameters, function (i) {
                return i.UniqueID
            }),
            QueryTypeOutList: getUniqueList(queryOutParameters, function (i) {
                return i.Name
            })
        };
        console.log(queryAction);
        return queryAction;
    },

    /**
     * Save the query
     * @param btn Button "Save"
     */
    onSave: function (btn) {
        var _this = this;
        var win = btn.up('window');

        // Get query object with all meta-data
        var obj = _this.getQueryObject(win);

        // Event
        win.fireEvent('QueryActionSaved', obj);
        win.close();
    },

    /**
     * Close the form (button click)
     * @param btn Button "Close"
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});
Ext.define('WebSystemsBuilder.controller.IDE.query.QueryFrom', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.query.QueryFrom'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.query.QueryFrom'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.query.QueryFrom'
    ],

    init: function () {
        this.control({
            'QueryFrom': {
                afterrender: this.onLoad
            },
            'QueryFrom combobox[name=newDataTable], combobox[name=joinTable]': {
                change: this.onChangeTable
            },
            'QueryFrom button[action=onSave]': {
                click: this.onSave
            },
            'QueryFrom button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win Window QueryFrom
     */
    onLoad: function (win) {
        var joinKind = win.down('combobox[name=joinKind]');
        var newDataTable = win.down('combobox[name=newDataTable]');
        var joinTable = win.down('combobox[name=joinTable]');
        var newTableField = win.down('combobox[name=newTableField]');
        var joinTableField = win.down('combobox[name=joinTableField]');
        var joinFieldSet = joinTable.up('fieldset');
        var isNew = win.queryDataTables == null || win.queryDataTables.length == 0;

        var loadJoinKindCombo = function(joinKindID) {
            CommonUtils.safeMask(joinKind);
            joinKind.getStore().load({
                callback: function () {
                    if (joinKindID) {
                        joinKind.setValue(joinKindID);
                    }
                    CommonUtils.safeUnmask(joinKind);
                }
            });
        };
        var loadJoinTableCombo = function () {
            if (win.queryDataTables) {
                joinTable.getStore().loadData(win.queryDataTables, false);
            }
        };
        var loadNewTableCombo = function(tableID) {
            CommonUtils.safeMask(newDataTable);
            newDataTable.getStore().load({
                callback: function () {
                    if (tableID) {
                        newDataTable.setValue(tableID);
                    }
                    CommonUtils.safeUnmask(newDataTable);
                }
            });
        };

        if (isNew) {
            loadJoinKindCombo();
            loadNewTableCombo();
            joinKind.setDisabled(true);
            joinFieldSet.setDisabled(true);
            newTableField.setDisabled(true);
        } else {
            loadJoinKindCombo(1);
            loadJoinTableCombo();
            loadNewTableCombo();
        }
    },

    /**
     * Change any table - load field list
     * @param combo
     */
    onChangeTable: function (combo) {
        var fs = combo.up('fieldset');
        var comboField = fs.query('combobox')[1];

        comboField.setValue(null);
        if (!combo.getValue()) {
            comboField.getStore().loadData([], false);
            return;
        }

        CommonUtils.safeMask(comboField);
        comboField.getStore().load({
            params: {
                tableID: combo.getValue()
            },
            callback: function () {
                CommonUtils.safeUnmask(comboField);
            }
        });
    },

    /**
     * Save data table
     * @param btn Button "Save"
     */
    onSave: function (btn) {
        var win = btn.up('window');
        var joinKind = win.down('combobox[name=joinKind]');
        var newDataTable = win.down('combobox[name=newDataTable]');
        var joinTable = win.down('combobox[name=joinTable]');
        var newTableField = win.down('combobox[name=newTableField]');
        var joinTableField = win.down('combobox[name=joinTableField]');
        var joinFieldSet = joinTable.up('fieldset');
        var isNew = win.queryDataTables == null || win.queryDataTables.length == 0;

        if (!newDataTable.getValue()) {
            MessageBox.show('Choose new data table');
            return;
        }
        if (!isNew) {
            if (!joinTableField.getValue() || !newTableField.getValue()) {
                MessageBox.error('Join new table to existing table.');
                return;
            }
            if (!joinKind.getValue()) {
                MessageBox.show('Choose join kind');
                return;
            }
        }

        // Event about new data table
        var newDataTable = {
            JoinKind: {
                JoinKindID: joinKind.getValue(),
                Name: joinKind.getRawValue()
            },
            Table: {
                TableID: newDataTable.getValue(),
                Name: newDataTable.getRawValue(),
                PhysicalTable: newDataTable.findRecordByValue(newDataTable.getValue()).get('PhysicalTable'),
                JoinColumn: {
                    ColumnID: newTableField.getValue(),
                    Name: newTableField.getRawValue(),
                    PhysicalColumn: newTableField.getValue() ? newTableField.findRecordByValue(newTableField.getValue()).get('PhysicalColumn') : null,
                    ValueTypeID: newTableField.getValue() ? newTableField.findRecordByValue(newTableField.getValue()).get('ValueTypeID') : null,
                    TableID: newTableField.getValue() ? newTableField.findRecordByValue(newTableField.getValue()).get('TableID') : null
                }
            },
            JoinTable: {
                TableID: joinTable.getValue(),
                Name: joinTable.getRawValue(),
                PhysicalTable: joinTable.getValue() ? joinTable.findRecordByValue(joinTable.getValue()).get('PhysicalTable') : null,
                JoinColumn: {
                    ColumnID: joinTableField.getValue(),
                    Name: joinTableField.getRawValue(),
                    PhysicalColumn: joinTableField.getValue() ? joinTableField.findRecordByValue(joinTableField.getValue()).get('PhysicalColumn') : null,
                    ValueTypeID: joinTableField.getValue() ? joinTableField.findRecordByValue(joinTableField.getValue()).get('ValueTypeID') : null,
                    JoinTableID: joinTableField.getValue() ? joinTableField.findRecordByValue(joinTableField.getValue()).get('TableID') : null
                }
            }
        };

        if (!isNew) {
            newDataTable.Condition = newDataTable.Table.Name + '.' + newDataTable.Table.JoinColumn.Name;
            newDataTable.Condition += ' = ';
            newDataTable.Condition += newDataTable.JoinTable.Name + '.' + newDataTable.JoinTable.JoinColumn.Name;
        }
        win.fireEvent('QueryFromIsReadyToSave', newDataTable);
        win.close();
    },

    /**
     * Функция акрытия формы.
     * @param btn Кнопка "Закрыть", вызвавшая событие закрытия формы
     */
    onClose: function (btn) {
        btn.up('window').close();
    }

});
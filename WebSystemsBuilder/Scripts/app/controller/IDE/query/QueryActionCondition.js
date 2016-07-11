Ext.define('WebSystemsBuilder.controller.IDE.query.QueryActionCondition', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.query.QueryActionCondition'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.query.QueryActionDataTable'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.query.QueryActionDataTable'
    ],

    init: function () {
        this.control({
            'QueryActionCondition': {
                afterrender: this.onLoad
            },
            'QueryActionCondition combobox[name=firstDataTable], combobox[name=secondDataTable]': {
                change: this.onChangeDictionary
            },
            'QueryActionCondition combobox[name=conditionSign]': {
                change: this.onChangeCondition
            },
            'QueryActionCondition radiofield[name=data]': {
                change: this.onChangeRadioData
            },
            'QueryActionCondition button[action=onSave]': {
                click: this.onSave
            },
            'QueryActionCondition button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form (afterrender).
     * @param win Window QueryActionCondition
     */
    onLoad: function (win) {
        var firstDataTable = win.down('combobox[name=firstDataTable]');
        var secondDataTable = win.down('combobox[name=secondDataTable]');
        var firstColumn = win.down('combobox[name=firstColumn]');
        var secondColumn = win.down('combobox[name=secondColumn]');
        var radio = win.down('radiogroup[name=rbData]');
        var secondConstant = win.down('textfield[name=secondConstant]');
        var conditionSign = win.down('combobox[name=conditionSign]');

        radio.setValue({'data': 1});
        if (win.queryDataTables && win.queryDataTables.length > 0) {
            secondDataTable.getStore().loadData(win.queryDataTables, false);
            firstDataTable.getStore().loadData(win.queryDataTables, false);
        }
    },

    /**
     * Load column store after data table selection
     * @param combo Combobox "Data table"
     */
    onChangeDictionary: function (combo) {
        var win = combo.up('window');
        var fieldset = combo.up('fieldset');
        var comboColumn = fieldset.down('combobox')[1];

        comboColumn.setValue(null);
        if (!combo.getValue()) {
            comboColumn.getStore().loadData([], false);
            return;
        }

        CommonUtils.safeMask(comboColumn);
        comboColumn.getStore().load({
            params: {
                tableID: combo.getValue()
            },
            callback: function () {
                CommonUtils.safeUnmask(comboColumn);
            }
        });
    },

    /**
     * Change condition's second member
     * @param radio Radiogroup
     */
    onChangeRadioData: function (radio) {
        var win = radio.up('window');
        var secondDataTable = win.down('combobox[name=secondDataTable]');
        var secondColumn = win.down('combobox[name=secondColumn]');
        var secondConstant = win.down('textfield[name=secondConstant]');
        var rbField = win.down('radiofield[action=rbField]');
        var rbValue = win.down('radiofield[action=rbValue]');

        if (rbField.checked) {
            secondDataTable.setDisabled(false);
            secondColumn.setDisabled(false);
            secondConstant.setDisabled(true);
        } else {
            secondDataTable.setDisabled(true);
            secondColumn.setDisabled(true);
            secondConstant.setDisabled(false);
        }
    },

    /**
     * Change sign -> Disable/enable secodn part of condition
     * @param combo Combobox "Condition sign"
     */
    onChangeCondition: function (combo) {
        var win = combo.up('window');
        var conditionSign = win.down('combobox[name=conditionSign]');
        var fieldset = win.down('fieldset[name=secondConditionMemberFieldset]');

        if (!Ext.Array.contains(['IS NULL', 'IS NOT NULL'], (conditionSign.getValue() || '').trim().toUpperCase())) {
            fieldset.setDisabled(true);
        } else {
            fieldset.setDisabled(false);
        }
    },

    /**
     * Save new condition
     * @param btn Button "Save"
     */
    onSave: function (btn) {
        var win = btn.up('window');
        var firstDataTable = win.down('combobox[name=firstDataTable]');
        var secondDataTable = win.down('combobox[name=secondDataTable]');
        var firstColumn = win.down('combobox[name=firstColumn]');
        var secondColumn = win.down('combobox[name=secondColumn]');
        var conditionSign = win.down('combobox[name=conditionSign]');
        var rbField = win.down('radiofield[action=rbField]');
        var rbValue = win.down('radiofield[action=rbValue]');
        var secondConstant = win.down('textfield[name=secondConstant]');

        if (!firstColumn.getValue() || !conditionSign.getValue()) {
            MessageBox.error('Create correct condition');
            return;
        }

        var conditionStr = firstDataTable.getRawValue() + '.' + firstColumn.getRawValue();
        conditionStr += ' ' + conditionSign.getValue();

        if (!Ext.Array.contains(['IS NULL', 'IS NOT NULL'], (conditionSign.getValue() || '').trim().toUpperCase())) {
            if (rbField.checked) {
                if (!secondColumn.getValue()) {
                    MessageBox.error('Create correct condition');
                    return;
                }
                conditionStr += ' ' + secondDataTable.getRawValue() + '.' + secondColumn.getRawValue();
            } else {
                if (!secondConstant.getValue()) {
                    MessageBox.error('Create correct condition');
                    return;
                }
                conditionStr += ' ' + secondConstant.getValue();
            }
        }

        // Event about new generated condition
        var generatedCondition = {
            ID: WebSystemsBuilder.IDE.Random.get(),
            firstField: {
                table: {
                    ID: firstDataTable.getValue(),
                    name: firstDataTable.getRawValue(),
                    tableName: firstDataTable.findRecordByValue(firstDataTable.getValue()).get('tableName')
                },
                field: {
                    ID: firstColumn.getValue(),
                    name: firstColumn.getRawValue(),
                    columnName: firstColumn.getValue() ? firstColumn.findRecordByValue(firstColumn.getValue()).get('columnName') : null,
                    domainValueTypeID: firstColumn.getValue() ? firstColumn.findRecordByValue(firstColumn.getValue()).get('domainValueTypeID') : null,
                    dictionaryID: firstColumn.getValue() ? firstColumn.findRecordByValue(firstColumn.getValue()).get('dictionaryID') : null
                }
            },
            condition: conditionSign.getValue(),
            isValue: rbValue.checked,
            conditionStr: conditionStr,
            secondField: {
                table: {
                    ID: secondDataTable.getValue(),
                    name: secondDataTable.getRawValue(),
                    tableName: secondDataTable.getValue() ? secondDataTable.findRecordByValue(secondDataTable.getValue()).get('tableName') : null
                },
                field: {
                    ID: secondColumn.getValue(),
                    name: secondColumn.getRawValue(),
                    columnName: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('columnName') : null,
                    domainValueTypeID: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('domainValueTypeID') : null,
                    dictionaryID: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('dictionaryID') : null
                },
                secondConstant: secondConstant.getValue()
            }
        };

        win.fireEvent('QueryActionConditionSaved', generatedCondition);
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
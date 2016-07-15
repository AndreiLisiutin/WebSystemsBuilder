Ext.define('WebSystemsBuilder.controller.IDE.query.QueryActionCondition', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.query.QueryActionCondition'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.query.QueryActionDataTable',
        'WebSystemsBuilder.model.IDE.MainIDE'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.query.QueryActionDataTable',
        'WebSystemsBuilder.store.IDE.MainIDE'
    ],

    init: function () {
        this.control({
            'QueryActionCondition': {
                afterrender: this.onLoad
            },
            'QueryActionCondition combobox[name=firstDataTable], combobox[name=secondDataTable]': {
                change: this.onChangeDataTable
            },
            'QueryActionCondition combobox[name=conditionSign]': {
                change: this.onChangeCondition
            },
            'QueryActionCondition radiogroup[name=rbData]': {
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
        var secondFormParameter = win.down('combobox[name=secondFormParameter]');

        radio.setValue({'data': 1});
        if (win.queryDataTables && win.queryDataTables.length > 0) {
            secondDataTable.getStore().loadData(win.queryDataTables, false);
            firstDataTable.getStore().loadData(win.queryDataTables, false);
            if (win.FirstTableID) {
                firstDataTable.setValue(win.FirstTableID);
                firstDataTable.setReadOnly(true);
            }
            if (win.SecondTableID) {
                secondDataTable.setValue(win.SecondTableID);
                secondDataTable.setReadOnly(true);
            }
        }

        var formParameters = FormParametersIDE.getFormParameters();
        secondFormParameter.getStore().loadData(formParameters, false);
    },

    /**
     * Load column store after data table selection
     * @param combo Combobox "Data table"
     */
    onChangeDataTable: function (combo) {
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
     * @param radioGroup Radiogroup
     */
    onChangeRadioData: function (radioGroup) {
        var win = radioGroup.up('window');
        var secondDataTable = win.down('combobox[name=secondDataTable]');
        var secondColumn = win.down('combobox[name=secondColumn]');
        var secondConstant = win.down('textfield[name=secondConstant]');
        var secondFormParameter = win.down('combobox[name=secondFormParameter]');
        var radio = win.down('radiogroup[name=rbData]');
        var rbField = win.down('radiofield[action=rbField]');
        var rbValue = win.down('radiofield[action=rbValue]');
        var rbParameter = win.down('radiofield[action=rbParameter]');

        if (radio.getValue()) {
            switch (radio.getValue().data) {
                case '1':
                    secondDataTable.setDisabled(false);
                    secondColumn.setDisabled(false);
                    secondConstant.setDisabled(true);
                    secondFormParameter.setDisabled(true);
                    break;
                case '2':
                    secondDataTable.setDisabled(true);
                    secondColumn.setDisabled(true);
                    secondConstant.setDisabled(true);
                    secondFormParameter.setDisabled(false);
                    break;
                case '3':
                    secondDataTable.setDisabled(true);
                    secondColumn.setDisabled(true);
                    secondFormParameter.setDisabled(true);
                    secondConstant.setDisabled(false);
                    break;
                default:
                    secondDataTable.setDisabled(true);
                    secondColumn.setDisabled(true);
                    secondConstant.setDisabled(true);
                    secondFormParameter.setDisabled(true);
                    break;
            }
        } else {
            secondDataTable.setDisabled(true);
            secondColumn.setDisabled(true);
            secondConstant.setDisabled(true);
            secondFormParameter.setDisabled(true);
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

        if (Ext.Array.contains(['IS NULL', 'IS NOT NULL'], (conditionSign.getValue() || '').trim().toUpperCase())) {
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
        var secondFormParameter = win.down('combobox[name=secondFormParameter]');
        var conditionSign = win.down('combobox[name=conditionSign]');
        var radio = win.down('radiogroup[name=rbData]');
        var rbField = win.down('radiofield[action=rbField]');
        var rbValue = win.down('radiofield[action=rbValue]');
        var rbParameter = win.down('radiofield[action=rbParameter]');
        var secondConstant = win.down('textfield[name=secondConstant]');

        if (!firstColumn.getValue() || !conditionSign.getValue()) {
            MessageBox.error('Create correct condition');
            return;
        }

        var conditionString = firstDataTable.getRawValue() + '.' + firstColumn.getRawValue();
        conditionString += ' ' + conditionSign.getValue();

        if (!Ext.Array.contains(['IS NULL', 'IS NOT NULL'], (conditionSign.getValue() || '').trim().toUpperCase())) {
            switch (radio.getValue().data) {
                case '1':
                    if (!secondColumn.getValue()) {
                        MessageBox.error('Create correct condition');
                        return;
                    }
                    conditionString += ' ' + secondDataTable.getRawValue() + '.' + secondColumn.getRawValue();
                    break;
                case '2':
                    if (!secondFormParameter.getValue()) {
                        MessageBox.error('Create correct condition');
                        return;
                    }
                    conditionString += ' {Param_' + secondFormParameter.getRawValue() + '}';
                    break;
                case '3':
                    if (!secondConstant.getValue()) {
                        MessageBox.error('Create correct condition');
                        return;
                    }
                    conditionString += ' ' + secondConstant.getValue();
                    break;
                default:
                    MessageBox.error('Create correct condition');
                    return;
            }
        }

        // Event about new generated condition
        var generatedCondition = {
            UniqueID: Random.get(),
            FirstPart: {
                Table: {
                    TableID: firstDataTable.getValue(),
                    Name: firstDataTable.getRawValue(),
                    PhysicalTable: firstDataTable.findRecordByValue(firstDataTable.getValue()).get('PhysicalTable')
                },
                Column: {
                    ColumnID: firstColumn.getValue(),
                    TableID: firstColumn.getValue() ? firstColumn.findRecordByValue(firstColumn.getValue()).get('TableID') : null,
                    Name: firstColumn.getRawValue(),
                    PhysicalColumn: firstColumn.getValue() ? firstColumn.findRecordByValue(firstColumn.getValue()).get('PhysicalColumn') : null,
                    ValueTypeID: firstColumn.getValue() ? firstColumn.findRecordByValue(firstColumn.getValue()).get('ValueTypeID') : null
                }
            },
            SecondPart: {
                Table: {
                    TableID: secondDataTable.getValue(),
                    Name: secondDataTable.getRawValue(),
                    PhysicalTable: secondDataTable.getValue() ? secondDataTable.findRecordByValue(secondDataTable.getValue()).get('PhysicalTable') : null
                },
                Column: {
                    ColumnID: secondColumn.getValue(),
                    TableID: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('TableID') : null,
                    Name: secondColumn.getRawValue(),
                    PhysicalColumn: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('PhysicalColumn') : null,
                    ValueTypeID: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('ValueTypeID') : null
                },
                FormParameter: {
                    Name: secondFormParameter.getRawValue(),
                    UniqueID: secondFormParameter.getValue(),
                    FormParameter: secondFormParameter.getValue() ? secondFormParameter.findRecordByValue(secondFormParameter.getValue()).get('FormParameter') : null,
                    PropertyValueType: secondFormParameter.getValue() ? secondFormParameter.findRecordByValue(secondFormParameter.getValue()).get('PropertyValueType') : null
                },
                Constant: secondConstant.getValue(),
                IsConstant: rbValue.checked,
                IsFormParameter: rbParameter.checked,
                IsColumn: rbField.checked
            },
            ConditionSign: conditionSign.getValue(),
            ConditionString: conditionString
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
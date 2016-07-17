Ext.define('WebSystemsBuilder.controller.IDE.query.QueryActionCondition', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.query.QueryActionCondition'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.query.QueryActionDataTable',
        'WebSystemsBuilder.model.IDE.event.ActionHandler',
        'WebSystemsBuilder.model.IDE.MainIDE'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.query.QueryActionDataTable',
        'WebSystemsBuilder.store.IDE.event.ActionHandler',
        'WebSystemsBuilder.store.IDE.MainIDE'
    ],

    init: function () {
        this.control({
            'QueryActionCondition': {
                afterrender: this.onLoad
            },
            'QueryActionCondition combobox[name=firstDataTable]': {
                change: this.onChangeFirstDataTable
            },
            'QueryActionCondition combobox[name=secondDataTable]': {
                change: this.onChangeSecondDataTable
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
        var secondFormControl = win.down('combobox[name=secondFormControl]');

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

        var formControls = FormControlsIDE.getControlList();
        secondFormControl.getStore().loadData(formControls, false);
    },

    /**
     * Load column store after data table selection
     * @param combo Combobox "Data table"
     */
    onChangeFirstDataTable: function (combo) {
        var win = combo.up('window');
        var fieldset = combo.up('fieldset');
        var comboColumn = fieldset.down('combobox[name=firstColumn]');

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
                if (win.FirstColumnID) {
                    comboColumn.setValue(win.FirstColumnID);
                    comboColumn.setReadOnly(true);
                }
            }
        });
    },

    /**
     * Load column store after data table selection
     * @param combo Combobox "Data table"
     */
    onChangeSecondDataTable: function (combo) {
        var win = combo.up('window');
        var fieldset = combo.up('fieldset');
        var comboColumn = fieldset.down('combobox[name=secondColumn]');

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
        var secondFormControl = win.down('combobox[name=secondFormControl]');
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
                    secondFormControl.setDisabled(true);
                    break;
                case '2':
                    secondDataTable.setDisabled(true);
                    secondColumn.setDisabled(true);
                    secondConstant.setDisabled(true);
                    secondFormParameter.setDisabled(false);
                    secondFormControl.setDisabled(true);
                    break;
                case '3':
                    secondDataTable.setDisabled(true);
                    secondColumn.setDisabled(true);
                    secondFormParameter.setDisabled(true);
                    secondConstant.setDisabled(false);
                    secondFormControl.setDisabled(true);
                    break;
                case '4':
                    secondDataTable.setDisabled(true);
                    secondColumn.setDisabled(true);
                    secondFormParameter.setDisabled(true);
                    secondConstant.setDisabled(true);
                    secondFormControl.setDisabled(false);
                    break;
                default:
                    secondDataTable.setDisabled(true);
                    secondColumn.setDisabled(true);
                    secondConstant.setDisabled(true);
                    secondFormParameter.setDisabled(true);
                    secondFormControl.setDisabled(true);
                    break;
            }
        } else {
            secondDataTable.setDisabled(true);
            secondColumn.setDisabled(true);
            secondConstant.setDisabled(true);
            secondFormParameter.setDisabled(true);
            secondFormControl.setDisabled(true);
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
        var secondFormControl = win.down('combobox[name=secondFormControl]');
        var conditionSign = win.down('combobox[name=conditionSign]');
        var radio = win.down('radiogroup[name=rbData]');
        var rbField = win.down('radiofield[action=rbField]');
        var rbValue = win.down('radiofield[action=rbValue]');
        var rbControl = win.down('radiofield[action=rbControl]');
        var rbParameter = win.down('radiofield[action=rbParameter]');
        var secondConstant = win.down('textfield[name=secondConstant]');

        if (!firstColumn.getValue() || !conditionSign.getValue()) {
            MessageBox.error('Create correct condition');
            return;
        }

        var getPhysicalDataTable = function (combo, physicalColumnName) {
            return combo.findRecordByValue(combo.getValue()).get(physicalColumnName || 'PhysicalTable');
        };
        var getPlaceHolder = function (combo, physicalColumnName) {
            var physicalName = getPhysicalDataTable(combo, physicalColumnName);
            return '{' + physicalName + '}';
        };

        var firstPhysicalDataTable = getPhysicalDataTable(firstDataTable);
        var firstDataTablePlaceHolder = getPlaceHolder(firstDataTable);
        var firstPhysicalColumn = getPhysicalDataTable(firstColumn, 'PhysicalColumn');
        var firstColumnPlaceHolder = getPlaceHolder(firstColumn, 'PhysicalColumn');

        var secondPhysicalDataTable = secondDataTable.getValue() ? getPhysicalDataTable(secondDataTable) : null;
        var secondDataTablePlaceHolder = secondDataTable.getValue() ? getPlaceHolder(secondDataTable) : null;
        var secondPhysicalColumn = secondColumn.getValue() ? getPhysicalDataTable(secondColumn, 'PhysicalColumn') : null;
        var secondColumnPlaceHolder = secondColumn.getValue() ? getPlaceHolder(secondColumn, 'PhysicalColumn') : null;

        var secondFormParameterPlaceHolder = '{' + secondFormParameter.getRawValue() + '}';
        var secondFormControlPlaceHolder = '{' + secondFormControl.getRawValue() + '}';

        // First part of condition
        var conditionString = firstDataTablePlaceHolder + '.' + firstColumnPlaceHolder;
        conditionString += ' ' + conditionSign.getValue() + ' ';

        var withoutSecondPart = Ext.Array.contains(['IS NULL', 'IS NOT NULL'], (conditionSign.getValue() || '').trim().toUpperCase());

        var parameter = null;
        if (!withoutSecondPart) {
            switch (radio.getValue().data) {
                case '1':
                    if (!secondColumn.getValue()) {
                        MessageBox.error('Create correct condition');
                        return;
                    }
                    conditionString += secondDataTablePlaceHolder + '.' + secondColumnPlaceHolder;
                    break;
                case '2':
                    if (!secondFormParameter.getValue()) {
                        MessageBox.error('Create correct condition');
                        return;
                    }
                    parameter = {
                        UniqueID: secondFormParameter.getValue(),
                        Name: secondFormParameter.getRawValue(),
                        QueryParameterTypeID: 2,
                        QueryParameterType: 'Form parameter'
                    };
                    conditionString += secondFormParameterPlaceHolder;
                    break;
                case '3':
                    if (!secondConstant.getValue()) {
                        MessageBox.error('Create correct condition');
                        return;
                    }
                    conditionString += secondConstant.getValue();
                    break;
                case '4':
                    if (!secondFormControl.getValue()) {
                        MessageBox.error('Create correct condition');
                        return;
                    }
                    parameter = {
                        UniqueID: secondFormControl.getValue(),
                        Name: secondFormControl.getRawValue(),
                        QueryParameterTypeID: 1,
                        QueryParameterType: 'Control'
                    };
                    conditionString += secondFormControlPlaceHolder;
                    break;
                default:
                    MessageBox.error('Create correct condition');
                    return;
            }
        }

        // Event about new generated condition
        var generatedCondition = {
            UniqueID: WebSystemsBuilder.utils.IDE.Random.get(),
            FirstPart: {
                Table: {
                    TableID: firstDataTable.getValue(),
                    Name: firstDataTable.getRawValue(),
                    PhysicalTable: firstPhysicalDataTable,
                    PlaceHolder: firstDataTablePlaceHolder
                },
                Column: {
                    ColumnID: firstColumn.getValue(),
                    TableID: firstDataTable.getValue(),
                    Name: firstColumn.getRawValue(),
                    PhysicalColumn: firstPhysicalColumn,
                    ValueTypeID: firstColumn.findRecordByValue(firstColumn.getValue()).get('ValueTypeID'),
                    PlaceHolder: firstColumnPlaceHolder
                }
            },
            SecondPart: {
                Table: {
                    TableID: secondDataTable.getValue(),
                    Name: secondDataTable.getRawValue(),
                    PhysicalTable: secondDataTable.getValue() ? secondPhysicalDataTable : null,
                    PlaceHolder: secondDataTable.getValue() ? secondDataTablePlaceHolder : null
                },
                Column: {
                    ColumnID: secondColumn.getValue(),
                    TableID: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('TableID') : null,
                    Name: secondColumn.getRawValue(),
                    PhysicalColumn: secondColumn.getValue() ? secondPhysicalColumn : null,
                    ValueTypeID: secondColumn.getValue() ? secondColumn.findRecordByValue(secondColumn.getValue()).get('ValueTypeID') : null,
                    PlaceHolder: secondColumn.getValue() ? secondColumnPlaceHolder : null
                },
                FormParameter: {
                    Name: secondFormParameter.getRawValue(),
                    UniqueID: secondFormParameter.getValue(),
                    FormParameter: secondFormParameter.getValue() ? secondFormParameter.findRecordByValue(secondFormParameter.getValue()).get('FormParameter') : null,
                    PropertyValueType: secondFormParameter.getValue() ? secondFormParameter.findRecordByValue(secondFormParameter.getValue()).get('PropertyValueType') : null,
                    PlaceHolder: secondFormParameter.getValue() ? secondFormParameterPlaceHolder : null
                },
                FormControl: {
                    Name: secondFormControl.getRawValue(),
                    UniqueID: secondFormControl.getValue(),
                    componentInfo: secondFormControl.getValue() ? secondFormControl.findRecordByValue(secondFormControl.getValue()).get('componentInfo') : null,
                    PlaceHolder: secondFormControl.getValue() ? secondFormControlPlaceHolder : null
                },
                Constant: secondConstant.getValue(),
                IsConstant: !withoutSecondPart && rbValue.checked,
                IsFormParameter: !withoutSecondPart && rbParameter.checked,
                IsFormControl: !withoutSecondPart && rbControl.checked,
                IsColumn: !withoutSecondPart && rbField.checked
            },
            Parameter: parameter,
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
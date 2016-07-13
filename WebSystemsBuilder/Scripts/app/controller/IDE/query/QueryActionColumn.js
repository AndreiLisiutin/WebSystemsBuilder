Ext.define('WebSystemsBuilder.controller.IDE.query.QueryActionColumn', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.query.QueryActionColumn'
    ],
    models: [
        'WebSystemsBuilder.model.IDE.query.QueryActionDataTable'
    ],
    stores: [
        'WebSystemsBuilder.store.IDE.query.QueryActionDataTable'
    ],

    init: function () {
        this.control({
            'QueryActionColumn': {
                afterrender: this.onLoad
            },
            'QueryActionColumn combobox[name=dataTable]': {
                change: this.onChangeDataTable
            },
            'QueryActionColumn button[action=onSave]': {
                click: this.onSave
            },
            'QueryActionColumn button[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form (afterrender)
     * @param win Window QueryFrom
     */
    onLoad: function (win) {
        var dataTable = win.down('combobox[name=dataTable]');
        var column = win.down('combobox[name=column]');

        var loadDataTableCombo = function () {
            if (win.dictionaries) {
                CommonUtils.safeMask(dataTable);
                dataTable.getStore().loadData(win.dictionaries, false);
                CommonUtils.safeUnmask(dataTable);
            }
        };

        loadDataTableCombo();
    },

    /**
     * Load columns combo after data table combo change
     * @param combo Combo "Data table"
     */
    onChangeDataTable: function (combo) {
        var win = combo.up('window');
        var dataTable = win.down('combobox[name=dataTable]');
        var column = win.down('combobox[name=column]');

        column.setValue(null);
        if (!dataTable.getValue()) {
            column.getStore().loadData([], false);
        } else {
            CommonUtils.safeMask(column);
            column.getStore().load({
                params: {
                    tableID: dataTable.getValue()
                },
                callback: function () {
                    CommonUtils.safeUnmask(column);
                }
            });
        }
    },

    /**
     * Save new column (button click)
     * @param btn Button "Save"
     */
    onSave: function (btn) {
        var win = btn.up('window');
        var dataTable = win.down('combobox[name=dataTable]');
        var column = win.down('combobox[name=column]');

        if (!dataTable.getValue()) {
            MessageBox.error('Choose data table');
            return;
        }
        if (!column.getValue()) {
            MessageBox.error('Choose column of data table');
            return;
        }

        // Event about successfull save
        var newColumn = {
            Table: {
                TableID: dataTable.getValue(),
                Name: dataTable.getRawValue(),
                PhysicalTable: dataTable.getValue() ? dataTable.findRecordByValue(dataTable.getValue()).get('PhysicalTable') : null
            },
            Column: {
                ColumnID: column.getValue(),
                TableID: column.getValue() ? column.findRecordByValue(column.getValue()).get('TableID') : null,
                Name: column.getRawValue(),
                PhysicalColumn: column.getValue() ? column.findRecordByValue(column.getValue()).get('PhysicalColumn') : null,
                ValueTypeID: column.getValue() ? column.findRecordByValue(column.getValue()).get('ValueTypeID') : null
            }
        };
        win.fireEvent('QuerySelectIsReadyToSave', newColumn);
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
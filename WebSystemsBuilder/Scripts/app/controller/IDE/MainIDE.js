Ext.define('WebSystemsBuilder.controller.IDE.MainIDE', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.MainIDE'
    ],

    models: [
        'WebSystemsBuilder.model.IDE.MainIDE',
        'WebSystemsBuilder.model.IDE.query.FormQuery',
        'WebSystemsBuilder.model.IDE.event.ComponentEvent',
        'WebSystemsBuilder.model.IDE.query.QueryFrom'
    ],

    stores: [
        'WebSystemsBuilder.store.IDE.MainIDE',
        'WebSystemsBuilder.store.IDE.query.FormQuery',
        'WebSystemsBuilder.store.IDE.event.ComponentEvent',
        'WebSystemsBuilder.store.IDE.query.QueryFrom'
    ],

    requires: [
        'WebSystemsBuilder.utils.IDE.Focused',
        'WebSystemsBuilder.utils.IDE.Random',
        'WebSystemsBuilder.utils.IDE.Queries'
    ],

    components: undefined,

    init: function () {
        this.control({
            'MainIDE': {
                afterrender: this.onLoad
            },
            'MainIDE menuitem[action=onSaveForm], button[action=onSaveForm]': {
                click: function (btn) {
                    this.onSaveForm(btn, false);
                }
            },
            'MainIDE menuitem[action=onNewForm], button[action=onNewForm]': {
                click: this.onNewFormQuestion
            },
            'MainIDE menuitem[action=onOpenForm], button[action=onOpenForm]': {
                click: this.onOpenFormQuestion
            },
            'MainIDE menuitem[action=onRenameForm]': {
                click: this.onRenameForm
            },
            'MainIDE button[action=onCode]': {
                click: this.onCode
            },
            'MainIDE button[action=onDesign]': {
                click: this.onDesign
            },
            'MainIDE gridpanel[name=componentsGroups]': {
                selectionchange: this.onComponentGroupChange
            },
            'MainIDE textfield[name=filter]': {
                change: this.onContextSearch
            },
            'MainIDE textfield[name=propertyFilter]': {
                change: this.onContextPropertySearch
            },
            'MainIDE propertygrid[name=properties]': {
                propertychange: this.onProperyChange
            },
            'MainIDE button[action=onEditEvent]': {
                click: this.onEditEvent
            },
            'MainIDE button[action=onShowEvent]': {
                click: this.onShowEvent
            },
            'MainIDE button[action=onDeleteEvent]': {
                click: this.onDeleteEvent
            },
            'MainIDE button[action=onAddQuery]': {
                click: this.onAddQuery
            },
            'MainIDE button[action=onSetParam]': {
                click: this.onSetParam
            },
            'MainIDE menuitem[action=onFormParams]': {
                click: this.onFormParams
            },
            'MainIDE combobox[name=query]': {
                change: this.onQueryTypeSelectionChange
            },
            'MainIDE button[action=onClose], menuitem[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * ������� ������������� ����������� ����� ������������ ���������. ���������� ����� ����� �������� ����� (afterrender).
     * � ������ ������� ���������� ��������� �������� ��������� � �������� ���� ��������� �����,
     * ��������� ������� ���������� ������� ��������� (Ext.FocusManager) � ���������� ��� ����������,
     * ���������� ������ String ������� startsWith,
     * �������� ������ ����������� ��������� �������� � ������� �� ������ �������������� ����� (��������� ������� componentfocus ������� Ext.FocusManager),
     * ��������� ������� ���������� � �������� ��������� �����
     * @param win
     */
    onLoad: function (win) {
        //Ext.FocusManager.enable();
        Ext.getBody().on("contextmenu", Ext.emptyFn, null, { preventDefault: true });
        var _this = this;
        var componentsPanel = win.down('panel[name=componentsPanel]');
        var projectPanel = win.down('panel[name=projectPanel]');
        var componentsGrid = win.down('gridpanel[name=components]');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesFilter = propertiesPanel.down('textfield[name=propertyFilter]');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var propertiesOwner = win.down('panel[name=propertiesOwner]');
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var tree = win.down('treepanel');
        var btnCode = win.down('button[action=onCode]');
        var btnDesign = win.down('button[action=onDesign]');
        var btnCopyToClipboard = win.down('button[action=onCopyToClipboard]');
        var btnSaveOnFile = win.down('button[action=onSaveOnFile]');
        var btnLabel = win.down('button[action=onLabel]');
        // �������
        var eventPanel = win.down('gridpanel[name=events]');
        // ������
        var dataPanel = win.down('panel[action=data]');
        var query = win.down('combobox[name=query]');
        var queryField = win.down('combobox[name=queryField]');
        var queryKeyField = win.down('combobox[name=queryKeyField]');

        // disable ����������
        componentsPanel.setDisabled(true);
        projectPanel.setDisabled(true);
        btnDesign.toggle(true);
        // ������� �� �����
        WebSystemsBuilder.utils.IDE.Queries.init();
        WebSystemsBuilder.utils.IDE.Random.init();
        win.inParams = [];
        win.outParams = [];

        // Delegate for all components loading
        var loadControlTypeGrid = function () {
            componentsGrid.getStore().load({
                callback: function (records, objServerResponse, success) {
                    var jsonResp = Ext.decode(objServerResponse._response.responseText);
                    if (jsonResp.Code == 0) {
                        // �������� ������ "���"
                        componentGroupGrid.getSelectionModel().select(componentGroupGrid.getStore().findRecord('ControlTypeGroupID', -1));

                    } else {
                        WebSystemsBuilder.utils.MessageBox.error(jsonResp.Message);
                    }
                },
                failure: function (objServerResponse) {
                    WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
                }
            });
        }

        // ��������� ������� ����� ����������� � ����� �����������
        componentGroupGrid.getStore().load({
            callback: function (records, objServerResponse, success) {
                var jsonResp = Ext.decode(objServerResponse._response.responseText);
                if (jsonResp.Code == 0) {
                    loadControlTypeGrid();

                } else {
                    WebSystemsBuilder.utils.MessageBox.error(jsonResp.Message);
                }
            },
            failure: function (objServerResponse) {
                WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
            }
        });

        // ����� ��������� �������� �����
        WebSystemsBuilder.utils.IDE.Focused.clearFocusedCmp();
        // ������� css ����� z-focused-element ��� ��������� ���������� � �������
        Ext.util.CSS.createStyleSheet('.z-focused-element { border-style:double ; border-width:1px; border-color: rgb(0,100,255); -webkit-box-shadow:0px 0px 30px 0px rgb(0,100,255); -moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);' +
            ' box-shadow:-moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);  }', 'z-focused-element');
        // ��� ������ ������ �� ����������� ����� �������� ���
        //Ext.FocusManager.clearListeners();
        //Ext.FocusManager.on('componentfocus', function (fm, cmp, previousCmp) {
        //    var focused = null;
        //    if (cmp.name && cmp.name.substr(0, 6) == 'sencha') {
        //        focused = cmp;
        //    } else if (cmp.componentCls.indexOf('fieldset-header') > -1 && cmp.up().xtype == 'fieldset'
        //        && cmp.up().name.substr(0, 6) == 'sencha') {
        //        focused = cmp.up();
        //    } else if (cmp.xtype == 'gridview' && cmp.up().xtype == 'gridpanel'
        //        && cmp.up().name.substr(0, 6) == 'sencha') {
        //        focused = cmp.up();
        //    } else if (cmp.componentCls.indexOf('tab-bar') > 1 && cmp.up().xtype == 'tabpanel'
        //        && cmp.up().name.substr(0, 6) == 'sencha') {
        //        focused = cmp.up();
        //    } else if (cmp.xtype == 'header' && cmp.up().name && cmp.up().name.substr(0, 6) == 'sencha' &&
        //        (cmp.up().xtype == 'panel' || cmp.up().xtype == 'window' || cmp.up().xtype == 'tabpanel' || cmp.up().xtype == 'gridpanel')) {
        //        focused = cmp.up();
        //    }
        //    propertiesPanel = win.down('panel[name=propertiesPanel]');
        //    if (focused) {
        //        WebSystemsBuilder.utils.IDE.Focused.setFocusedCmp(focused);
        //        propertiesOwner.update('<span style="margin:3px;position:absolute;">' + renderIcon(focused.record.get('icon')) + '&nbsp' +
        //            focused.record.get('component') + '&nbsp&nbsp' + '<i>' + focused.record.get('path') + '</i>&nbsp' + '</span>');
        //        propertiesGrid.setSource(focused.record.get('properties'));
        //        propertiesGrid.customEditors = focused.record.get('sourceConfig');
        //        var treeEl = tree.getRootNode().findChild('id', focused.name, true);
        //        if (treeEl) {
        //            tree.getSelectionModel().select(treeEl);
        //        }
        //        propertiesPanel.setDisabled(false);
        //        // ������
        //        var panel = win.down('panel[name=data]');
        //        var loaded1 = false, loaded2 = false;
        //        if (panel.el) panel.el.mask('��������...');
        //        if (focused.xtype == 'combobox') {
        //            queryKeyField.show();
        //        } else {
        //            queryKeyField.hide();
        //        }
        //        var data = focused.record.get('data');
        //        query.setValue(data['queryID']);
        //        if (!query.getValue()) {
        //            queryField.getStore().loadData([], false);
        //            queryKeyField.getStore().loadData([], false);
        //            if (panel.el) panel.el.unmask();
        //        } else {
        //            queryField.getStore().load({
        //                params: {
        //                    ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
        //                },
        //                callback: function () {
        //                    if (data['queryOutValueID']) queryField.setValue(data['queryOutValueID']);
        //                    loaded1 = true;
        //                    if (panel.el && loaded2) panel.el.unmask();
        //                }
        //            });
        //            queryKeyField.getStore().load({
        //                params: {
        //                    ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
        //                },
        //                callback: function () {
        //                    if (data['queryOutKeyID']) queryKeyField.setValue(data['queryOutKeyID']);
        //                    loaded2 = true;
        //                    if (panel.el && loaded1) panel.el.unmask();
        //                }
        //            });
        //        }
        //        dictionaryField.setValue(data['saveField']);
        //        // �������
        //        var events = focused.record.get('events');
        //        eventPanel.getStore().loadData(events, false);
        //    } else if (!WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp()) {
        //        propertiesGrid.setSource([]);
        //        propertiesGrid.customEditors = [];
        //        propertiesOwner.update('');
        //        propertiesFilter.setValue('');
        //        tree.getSelectionModel().deselectAll();
        //        propertiesPanel.setDisabled(true);
        //        queryField.clearValue();
        //        queryKeyField.clearValue();
        //        query.clearValue();
        //        dictionaryField.clearValue();
        //        eventPanel.getStore().loadData([], false);
        //    }
        //});

        // ��� ��������� ������ ���������������� ������� "�������" � �����������
        eventPanel.on('RecordChanged', function (grid) {
            var focused = WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp();
            if (focused) {
                var newEvents = [];
                eventPanel.getStore().data.items.forEach(function (item) {
                    newEvents.push(item.data);
                });
                focused.record.set('events', newEvents);
            }
        });

        // ��� ��������� ������ ���������������� ������� "������" � �����������
        query.on('change', function (comboChanged) {
            var focused = WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['queryID'] = query.getValue();
            }
        });
        queryField.on('change', function (comboChanged) {
            var focused = WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['queryOutValueID'] = queryField.getValue();
            }
        });
        queryKeyField.on('change', function (comboChanged) {
            var focused = WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['queryOutKeyID'] = queryKeyField.getValue();
            }
        });
        dictionaryField.on('change', function (comboChanged) {
            var focused = WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp();
            if (focused) {
                focused.record.get('data')['saveField'] = dictionaryField.getValue();
            }
        });

        // ��� ���������� � �������� ��������� ����� �������������� ������ �������
        form.on('ComponentAdded', _this.onAddComponent);
        form.on('ComponentRemoved', _this.onRemoveComponent);
        // ��� �������� ����� ������������� ������ ���������� ������� ���������
        win.on('beforeclose', function () {
            Ext.FocusManager.disable();
        });
    },

    //==============================================��������� �����==============================================

    /**
     * ������� ���������� �����.
     * @param btn
     */
    onSaveForm: function (btn, close) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var _this = this;
        // �������� ������, �������� � ���� �������� �����
        var obj = this.getJsonForm(form);
        if (!win.form_name) {
            var error = '����� ��� �� �������.';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
            return;
        }
        if (obj == null || typeof obj == 'undefined') {
            var error = '����� ������.';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
            return;
        }

        var queryInParams = WebSystemsBuilder.utils.IDE.Queries.getInParams();
        var queries = WebSystemsBuilder.utils.IDE.Queries.get();

        // ����������� ������� ����������
        var orderNumber = 0;
        var deleteID = [];
        var fn = function (item, parent) {
            orderNumber++;
            var current = {
                control: {
                    ID: undefined,
                    controlTypeID: item['controlTypeID'] ? item['controlTypeID'] + '' : '',
                    controlIDParent: undefined,
                    formID: undefined,
                    orderNumber: orderNumber + ''
                },
                name: item['name'],
                items: [],
                properties: [],
                queries: queries,
                queryInParams: queryInParams,
                data: item['data'],
                events: item['events']
            };
            // ��������� �������� �������
            for (var prop in item) {
                if (!(item[prop] instanceof Array) && prop != 'controlTypeID' && prop != 'data' && prop != 'events') {
                    var property = {
                        controlID: undefined,
                        controlTypeID: item['controlTypeID'] ? item['controlTypeID'] + '' : '',
                        property: prop,
                        value: item[prop]
                    };
                    current.properties.push(property);
                }
            }
            for (var prop in item) {
                if (item[prop] instanceof Array && prop != 'events') {
                    item[prop].forEach(function (x) {
                        current.items.push(fn(x, item));
                    });
                }
            }
            return current;
        };

        // ������� ������� id ����������� ����� ����������, �.� ��� �� ������� ����������
        // @deprecated
        var setID = function (item) {
            var el = form.query('component[name=' + item['name'] + ']')[0];
            if (el) {
                el.record.get('properties')['id'] = item.control['ID'];
            }
            if (item.items && item.items instanceof Array) {
                item.items.forEach(function (x) {
                    setID(x);
                });
            }
        };

        win.body.mask('����������...');
        var newFormObj = fn(obj, null);
        // AJAX ������ �� ���������� �����
        // ���������� �������� ������������� ������� �������� ����� � ���������� �����
        Ext.Ajax.timeout = 1000000;
        Ext.Ajax.request({
            url: 'MainIDE/SaveFormInTransaction',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            timeout: 1000000,
            jsonData: {
                formModel: {
                    inParams: win.inParams,
                    outParams: win.outParams,
                    form: {
                        ID: win.form_id ? win.form_id + '' : '',
                        name: win.form_name,
                        dictionaryID: win.form_dictionary_id ? win.form_dictionary_id + '' : ''
                    },
                    control: newFormObj
                }
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    // ����� ���������
                    win.form_id = jsonResp.resultID;
                    if (close) {
                        win.body.unmask();
                        win.close();
                        return;
                    }
                    // ������� ���������� � �����
                    if (form.down('[name=senchawin]')) {
                        form.fireEvent('ComponentRemoved', form, form, form.down('[name=senchawin]'));
                    }
                    form.removeAll();
                    form.doLayout();
                    WebSystemsBuilder.utils.IDE.Queries.clear();
                    WebSystemsBuilder.utils.IDE.Random.clear();
                    win.inParams = [];
                    win.outParams = [];
                    win.body.unmask();
                    // ��������� ������� �����
                    _this.openForm(win);
                } else {
                    win.body.unmask();
                    WebSystemsBuilder.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                WebSystemsBuilder.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    //==============================================������� �����==============================================

    /**
     * ������� �������� ������� "��������� �����?" ��� �������� �����
     * @param btn
     */
    onOpenFormQuestion: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (win.form_name || win.form_id) {
            WebSystemsBuilder.utils.MessageBox.question('��������� ����� ' + (win.form_name ? ('"' + win.form_name + '"') : '') + '?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res);
                    _this.clearCurrentForm(form);
                    _this.onOpenForm(btn);
                } else if (res == 'no') {
                    _this.clearCurrentForm(form);
                    _this.onOpenForm(btn);
                } else {
                    return;
                }
            }, Ext.Msg.YESNOCANCEL);
        } else {
            _this.clearCurrentForm(form);
            _this.onOpenForm(btn);
        }
    },

    /**
     * �������, ����������� ���������� ���� ������ ����� ��� ��������������.
     * @param btn ������ "�������", ��������� �������
     */
    onOpenForm: function (btn) {
        var _this = this;
        var win = btn.up('window');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.OpenFormDialog');
        var openFormDialog = WebSystemsBuilder.utils.Windows.open('OpenFormDialog', {}, null, true);
        openFormDialog.on('FormIsReadyToOpen', function (winDialog, form_id, form_name, form_dictionary_id) {
            win.form_id = form_id;
            win.form_name = form_name;
            win.form_dictionary_id = form_dictionary_id;
            _this.openForm(win);
        })
    },

    /**
     * �������, ����������� �����
     * @param win
     */
    openForm: function (win) {
        var _this = this;
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var dictionaryFieldSet = dictionaryField.up('fieldset');
        var query = win.down('combobox[name=query]');
        // Ajax ������ �� ��������� �����
        win.body.mask('��������...');
        Ext.Ajax.request({
            url: 'MainIDE/GetFormByID',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            params: {
                id: win.form_id + ''
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    var res = jsonResp.Data;
                    // ����������� ����� � ������� ����������� �������
                    _this.drawForm(win, res);
                    WebSystemsBuilder.utils.IDE.Queries.queries = res.queries;
                    query.getStore().loadData(WebSystemsBuilder.utils.IDE.Queries.get(), false);
                    win.setTitle('���������� �������� ����. ' + win.form_name);
                    _this.setEnabledComponents(win);
                    // ��������� ����� "����" �� ������� "������"
                    if (win.form_dictionary_id) {
                        dictionaryFieldSet.expand();
                        dictionaryField.setReadOnly(false);
                        dictionaryField.getStore().load({
                            params: {
                                dictionaryID: win.form_dictionary_id + ''
                            }
                        });
                    } else {
                        dictionaryField.setReadOnly(true);
                        dictionaryField.clearValue();
                        dictionaryFieldSet.collapse();
                    }
                    win.body.unmask();
                } else {
                    WebSystemsBuilder.utils.MessageBox.show(jsonResp.resultMessage, null, -1);
                    win.body.unmask();
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                WebSystemsBuilder.utils.MessageBox.show(objServerResponse.responseText, null, -1);
            }
        });
    },

    //==============================================����� �����==============================================

    /**
     * ������� �������� ����� �����
     * @param btn
     */
    onNewFormQuestion: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (win.form_name || win.form_id) {
            WebSystemsBuilder.utils.MessageBox.question('��������� ����� ' + (win.form_name ? ('"' + win.form_name + '"') : '') + '?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res);
                    _this.clearCurrentForm(form);
                    _this.onNewForm(btn);
                } else if (res == 'no') {
                    _this.clearCurrentForm(form);
                    _this.onNewForm(btn);
                } else {
                    return;
                }
            }, Ext.Msg.YESNOCANCEL);
        } else {
            _this.clearCurrentForm(form);
            _this.onNewForm(btn);
        }
    },

    /**
     * �������, ������������ ����� ������� "��������� �����?" ��� �������� ����� �����
     * @param btn
     */
    onNewForm: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var dictionaryFieldSet = dictionaryField.up('fieldset');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.CreateFormDialog');
        var createFormDialog = WebSystemsBuilder.utils.Windows.open('CreateFormDialog', {}, null, true);
        createFormDialog.on('FormIsReadyToCreate', function (winDialog, form_name, dictionary_id) {
            win.form_name = form_name;
            win.form_id = undefined;
            win.form_dictionary_id = dictionary_id;
            _this.setEnabledComponents(win);
            // ��������� ����� "����" �� ������� "������"
            if (win.form_dictionary_id) {
                dictionaryFieldSet.expand();
                dictionaryField.setReadOnly(false);
                dictionaryField.getStore().load({
                    params: {
                        dictionaryID: win.form_dictionary_id + ''
                    }
                });
            } else {
                dictionaryField.setReadOnly(true);
                dictionaryField.clearValue();
                dictionaryFieldSet.collapse();
            }
            win.setTitle('���������� �������� ����. ' + form_name);
        });
    },

    //==============================================������������� �����==============================================

    /**
     * �������, ����������������� �����
     * @param btn
     */
    onRenameForm: function (btn) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (!win.form_name) {
            var error = '����� ��� �� �������.';
            WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
            return;
        }
        // ��������� ���� �������������� �����
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.RenameFormDialog');
        var createFormDialog = WebSystemsBuilder.utils.Windows.open('RenameFormDialog', { form_id: win.form_id, form_name: win.form_name }, null, true);
        createFormDialog.on('FormIsReadyToRename', function (winDialog, form_name) {
            win.form_name = form_name;
            win.setTitle('���������� �������� ����. ' + form_name);
        });
    },


    //==================================================================================================================
    //===================================================�������========================================================
    //==================================================================================================================

    /**
     * �������� JSON ������ �����
     * @private
     * @param form �����
     * @return {*} JSON ������
     */
    getJsonForm: function (form) {
        var win = form.up('window');
        var localWindow = form.down('[name=senchawin]');
        var availableComponents = ['button', 'combobox', 'container', 'datecolumn', 'datefield', 'fieldset', 'gridcolumn', 'gridpanel', 'numbercolumn', 'numberfield',
            'panel', 'tab', 'tabpanel', 'textfield', 'toolbar'];

        var fn = function (item) {
            if (item == null || typeof item == 'undefined') {
                return null;
            }
            var items = [];
            var dockedItems = [];
            var query = [];
            if (item.query) {
                query = item.query('> component');
                if (item.xtype == 'gridpanel') {
                    query = query.concat(item.columnManager.columns);
                }
                // query all children
                query.forEach(function (child) {
                    if (child.xtype && Ext.Array.contains(availableComponents, child.xtype) && child.name && child.name.startsWith('sencha')) {
                        if (child.xtype == 'toolbar') {
                            dockedItems.push(child);
                        } else {
                            items.push(child);
                        }
                    }
                });
            }
            // create obj
            var obj = JSON.parse(JSON.stringify(item.record.get('properties')));
            var data = JSON.parse(JSON.stringify(item.record.get('data')));
            var events = JSON.parse(JSON.stringify(item.record.get('events')));
            obj.controlTypeID = item.record.get('ID');
            obj.data = data;
            obj.events = events;

            // recursion
            if (items.length > 0) {
                if (item.xtype == 'gridpanel') {
                    obj.columns = [];
                    items.forEach(function (i) {
                        obj.columns.push(fn(i));
                    });
                } else {
                    obj.items = [];
                    items.forEach(function (i) {
                        obj.items.push(fn(i));
                    });
                }
            }
            if (dockedItems.length > 0) {
                obj.dockedItems = [];
                dockedItems.forEach(function (i) {
                    obj.dockedItems.push(fn(i));
                });
            }

            return obj;
        };

        var obj = fn(localWindow);
        return obj;
    },

    /**
     * �������, ��������� ������� ������������� ����.
     * @param form �����
     */
    clearCurrentForm: function (form) {
        var win = form.up('window');
        if (form.down('[name=senchawin]')) {
            form.fireEvent('ComponentRemoved', form, form, form.down('[name=senchawin]'));
        }
        form.removeAll();
        form.doLayout();
        WebSystemsBuilder.utils.IDE.Queries.clear();
        WebSystemsBuilder.utils.IDE.Random.clear();
        win.inParams = [];
        win.outParams = [];
        win.form_id = undefined;
        win.form_dictionary_id = undefined;
        win.form_name = undefined;
        win.setTitle('���������� �������� ����');
    },

    /**
     * ���������� ����� ������� ������ ��� ���������� ���������� �� �����
     * @param form �����, �� ������� ����������� ��� ����������
     * @param parent ������������ ������� ��� ������
     * @param addedItem ����������� �������
     */
    onAddComponent: function (form, parent, addedItem) {
        var win = form.up('window');
        var tree = win.down('treepanel');
        var parentNode = tree.getRootNode().findChild('id', parent.name, true);
        if (!parentNode && parent.name == form.name) {
            parentNode = tree.getRootNode();
        }
        if (parentNode) {
            var newNode = {
                text: addedItem.record.get('component'),
                name: addedItem.name,
                expanded: true,
                id: addedItem.name,
                icon: addedItem.record.get('icon'),
                children: []
            };
            parentNode.appendChild(newNode, false, true);
            tree.doLayout();
        } else {
            console.log('Adding node error. Cant find parent node: ' + parent);
        }
    },

    /**
     * ������� ������� ������ ��� �������� ���������� � �����
     * @param form �����, �� ������� ����������� ��� ����������
     * @param parent ������������ ������� ��� ���������
     * @param removedItem ��������� �������
     */
    onRemoveComponent: function (form, parent, removedItem) {
        var win = form.up('window');
        var tree = win.down('treepanel');
        var parentNode = tree.getRootNode().findChild('id', parent.name, true);
        var removedNode = tree.getRootNode().findChild('id', removedItem.name, true);
        if (!parentNode && parent.name == form.name) {
            parentNode = tree.getRootNode()
        }
        if (!parentNode) {
            console.log('Removing node error. Cant find parent node: ' + parent);
        } else if (!removedNode) {
            console.log('Removing node error. Cant find node to remove : ' + removedItem);
        } else {
            parentNode.removeChild(removedNode);
            tree.doLayout();
        }
    },

    //================================================== ������� ==================================================

    /**
     * ������� ���������� ������ ������� � ������������
     * @param btn ������ "+", ��������� �������
     */
    onAddQuery: function (btn) {
        var win = btn.up('window');
        var query = win.down('combobox[name=query]');
        var form = win.down('form[name=mainPanel]');
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.query.FormQueries');
        var createQuery = WebSystemsBuilder.utils.Windows.open('FormQueries', {
            form: form
        }, null, true);
        createQuery.on('FormQuerySaved', function (winQuery, obj) {
            WebSystemsBuilder.utils.IDE.Queries.add(obj);
            // ����������� ����� � ���������
            query.getStore().loadData(WebSystemsBuilder.utils.IDE.Queries.get(), false);
            var newQuery = query.getStore().findRecord('_ID', obj._ID);
            if (newQuery) {
                query.select(newQuery);
            }
        });
    },

    /**
     * ����������� ������� ���������� ��� ������ �������
     * @param combo ����� ������
     */
    onQueryTypeSelectionChange: function (combo) {
        var win = combo.up('window');
        var query = win.down('combobox[name=query]');
        var queryField = win.down('combobox[name=queryField]');
        var queryKeyField = win.down('combobox[name=queryKeyField]');
        queryField.clearValue();
        queryKeyField.clearValue();
        if (!query.getValue()) {
            queryField.getStore().loadData([], false);
            queryKeyField.getStore().loadData([], false);
        } else {
            queryField.getStore().load({
                params: {
                    ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
                }
            });
            queryKeyField.getStore().load({
                params: {
                    ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
                }
            });
        }
    },

    //===================================================����� �������==================================================

    /**
     * ���������� �����, ���������� � ���� JSON ������� (res)
     * @param win ���� ��������� ����
     * @param res ������ �����
     */
    drawForm: function (win, res) {
        var _this = this;
        var form = win.down('form[name=mainPanel]');
        var components = win.down('gridpanel[name=components]');
        var store = deepCloneStore(components.getStore());
        if (!res.root) {
            var error = '����� �����.';
            console.warn(error);
            return;
        }
        // ����������� ������� �������� ��������
        // obj typeof OpenControlModel
        var fn = function (obj, parent) {
            if (!obj || !parent || !obj.properties) {
                var error = '��� �������� ����� �� �������������� ��������� ������: ������ ����.';
                WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
                return;
            }
            var xtype, layout;
            obj.properties.forEach(function (x) {
                if (x.property.toLowerCase() == 'xtype') {
                    xtype = x.value.toLowerCase();
                }
                if (x.property.toLowerCase() == 'layout') {
                    layout = x.value.toLowerCase();
                }
            });
            if (!xtype) {
                var error = '��� �������� ����� �� �������������� ��������� ������: ������ �� ����� ����.' + obj['name'] ? obj['name'] : '';
                WebSystemsBuilder.utils.MessageBox.show(error, null, -1);
                return;
            }
            // �������� ������ �� ��������� �����������, ��������������� ��������
            var controlType = obj.control['controlType'];
            var selectedRecord = store.findRecord('component', controlType.toLowerCase());
            var item;
            // ������� ������ � ������� ������ ��������
            if (xtype == 'container') {
                item = eval(xtype.toLowerCase() + 'Factory(win, parent, selectedRecord, layout);');
            } else {
                item = eval(controlType.toLowerCase() + 'Factory(win, parent, selectedRecord);');
            }
            item.name = obj['name'];
            item.record.set('events', obj.events);
            item.record.set('data', obj.data);

            if (item.xtype == 'toolbar') {
                parent.addDocked(item);
            } else if (Ext.Array.contains(['gridcolumn', 'datecolumn', 'numbercolumn'], item.xtype)) {
                parent.headerCt.insert(parent.columns.length, item);
                parent.getView().refresh();
            } else {
                parent.add(item);
            }
            parent.doLayout();
            form.doLayout();
            form.fireEvent('ComponentAdded', form, parent, item);
            // �������� �������� �������
            WebSystemsBuilder.utils.IDE.Focused.setFocusedCmp(item);
            obj.properties.forEach(function (prop) {
                _this.onProperyChange(null, prop['property'], prop['_value']);
            });
            WebSystemsBuilder.utils.IDE.Focused.clearFocusedCmp();
            // ��������
            if (obj.items && obj.items instanceof Array && obj.items.length > 0) {
                obj.items.forEach(function (i) {
                    fn(i, item);
                });
            }
        };

        fn(res.root, form);
    },

    /**
     * ������������� JSON ��� ����������� �����
     * @param btn
     */
    onCode: function (btn) {
        var win = btn.up('window');
        var mainContainer = win.down('form[name=mainContainer]');
        var form = mainContainer.down('form[name=mainPanel]');
        var codeText = mainContainer.down('textareafield[name=codeText]');
        var btnLabel = win.down('button[action=onLabel]');
        if (!form.down('[name=senchawin]')) {
            console.warn('��� ������� �������� ��� ������� ��������������: ����� ������.');
            return;
        }
        // delete empty properties function
        var fnDeleteEmptyProperties = function (item) {
            debugger;
            delete item['data'];
            delete item['events'];
            for (var prop in item) {
                if (!(item[prop] instanceof Array)) {
                    if (item[prop] == null || typeof item[prop] == 'undefined' || item[prop].toString().trim() == ''
                        || prop == 'controlTypeID' || prop == 'id') {
                        delete item[prop];
                    }
                }
            }
            for (var prop in item) {
                if (item[prop] instanceof Array) {
                    if (item[prop] != null || item[prop].length > 0) {
                        item[prop].forEach(function (x) {
                            fnDeleteEmptyProperties(x);
                        });
                    }
                }
            }
        };
        // JSON ������
        var obj = this.getJsonForm(form);
        fnDeleteEmptyProperties(obj);

        form.hide();
        codeText.show();
        codeText.setValue(JSON.stringify(obj, null, '\t'));
        btnLabel.show();
    },

    /**
     * �������� ������������� �����
     * @param btn
     */
    onDesign: function (btn) {
        var win = btn.up('window');
        var mainContainer = win.down('form[name=mainContainer]');
        var form = mainContainer.down('form[name=mainPanel]');
        var codeText = mainContainer.down('textareafield[name=codeText]');
        var btnLabel = win.down('button[action=onLabel]');
        codeText.hide();
        form.show();
        btnLabel.hide();
    },

    /**
     * Change any property in propertygrid
     * @param source The source data object for the grid (corresponds to the same object passed in as the source config property).
     * @param recordId The record's id in the data store
     * @param value The current edited property value
     * @param oldValue The original property value prior to editing
     * @param eOpts The options object passed to Ext.util.Observable.addListener.
     */
    onProperyChange: function (source, recordId, value, oldValue, eOpts) {
        var focused = WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp();
        var win = focused.up('window[name=MainIDE]');
        var form = win.down('form[name=mainPanel]');
        focused.record.get('properties')[recordId] = value;
        var componentName = focused.record.get('component').toLowerCase();

        // ����
        if (focused.record.get('component').toLowerCase() == 'textfield' ||
            focused.record.get('component').toLowerCase() == 'datefield' ||
            focused.record.get('component').toLowerCase() == 'numberfield' ||
            focused.record.get('component').toLowerCase() == 'combobox') {
            switch (recordId) {
                case 'anchor':
                    if (!value || value.toString().trim() == '') {
                        focused.anchor = undefined;  // set anchor
                        delete focused.anchorSpec;   // remove the grid's anchor cache
                    } else {
                        focused.anchor = value;
                    }
                    break;
                case 'allowBlank':
                    break;
                case 'allowExponential':
                    break;
                case 'allowDecimals':
                    break;
                case 'blankText':
                    break;
                case 'caseSensitive':
                    break;
                case 'disabled':
                    break;
                case 'decimalPrecision':
                    break;
                case 'displayField':
                    break;
                case 'emptyText':
                    break;
                case 'editable':
                    break;
                case 'fieldLabel':
                    focused.setFieldLabel(value);
                    break;
                case 'format':
                    break;
                case 'flex':
                    focused.flex = value;
                    break;
                case 'hidden':
                    if (value) {
                        focused.hide();
                    } else {
                        focused.show();
                    }
                    break;
                case 'invalidText':
                    break;
                case 'labelSeparator':
                    focused.labelSeparator = value;
                    focused.setFieldLabel(focused.getFieldLabel());
                    break;
                case 'labelWidth':
                    focused.labelWidth = value;
                    focused.labelCell.setWidth(focused.labelWidth);
                    break;
                case 'margin':
                    setMargin(focused.getEl(), value);
                    break;
                case 'maskRe':
                    break;
                case 'maxWidth':
                    focused.maxWidth = value;
                    break;
                case 'minWidth':
                    focused.minWidth = value;
                    break;
                case 'minText':
                    break;
                case 'maxText':
                    break;
                case 'minValue':
                    break;
                case 'maxValue':
                    break;
                case 'mouseWheelEnabled':
                    break;
                case 'multiSelect':
                    break;
                case 'queryMode':
                    break;
                case 'nanText':
                    break;
                case 'step':
                    break;
                case 'readOnly':
                    focused.setReadOnly(value);
                    break;
                    //                case 'value':
                    //                    if (focused.record.get('component').toLowerCase() == 'combobox') {
                    //                        focused.setRawValue(value);
                    //                    } else {
                    //                        focused.setValue(value);
                    //                    }
                    //                    break;
                case 'valueField':
                    break;
                case 'width':
                    focused.setWidth(value);
                    break;
                default:
                    break;
            }
        }

        // �������
        if (focused.record.get('component').toLowerCase() == 'gridcolumn' ||
            focused.record.get('component').toLowerCase() == 'datecolumn' ||
            focused.record.get('component').toLowerCase() == 'numbercolumn') {
            var gridpanel = focused.up('gridpanel');
            switch (recordId) {
                case 'align':
                    focused.align = value;
                    break;
                case 'dataIndex':
                    break;
                case 'disabled':
                    break;
                case 'draggable':
                    focused.draggable = value;
                    break;
                case 'emptyCellText':
                    focused.emptyCellText = value;
                    break;
                case 'flex':
                    focused.flex = value;
                    break;
                case 'format':
                    focused.format = value;
                    break;
                case 'hideable':
                    focused.hideable = value;
                    break;
                case 'hidden':
                    if (value) {
                        focused.hide();
                    } else {
                        focused.show();
                    }
                    break;
                case 'locked':
                    focused.locked = value;
                    break;
                case 'maxWidth':
                    focused.maxWidth = value;
                    break;
                case 'minWidth':
                    focused.minWidth = value;
                    break;
                case 'menuDisabled':
                    focused.menuDisabled = value;
                    break;
                case 'resizable':
                    focused.resizable = value;
                    break;
                case 'sortable':
                    focused.sortable = value;
                    break;
                case 'text':
                    focused.setText(value);
                    break;
                case 'width':
                    focused.setWidth(value);
                    break;
                default:
                    break;
            }
            gridpanel.getView().refresh();
            focused.doLayout();
        }

        // ����, ������, ���������, �����, �������, ������, ���������, �������, ������
        if (focused.record.get('component').toLowerCase() == 'window' ||
            focused.record.get('component').toLowerCase() == 'panel' ||
            focused.record.get('component').toLowerCase() == 'tabpanel' ||
            focused.record.get('component').toLowerCase() == 'newtab' ||
            focused.record.get('component').toLowerCase() == 'gridpanel' ||
            focused.record.get('component').toLowerCase() == 'toolbar' ||
            focused.record.get('component').toLowerCase() == 'container (hbox)' ||
            focused.record.get('component').toLowerCase() == 'container (vbox)' ||
            focused.record.get('component').toLowerCase() == 'fieldset' ||
            focused.record.get('component').toLowerCase() == 'button') {
            switch (recordId) {
                case 'activeTab':
                    focused.setActiveTab(value);
                    break;
                case 'anchor':
                    if (!value || value.toString().trim() == '') {
                        focused.anchor = undefined;  // set anchor
                        delete focused.anchorSpec;   // remove the grid's anchor cache
                    } else {
                        focused.anchor = value;
                    }
                    break;
                case 'allowDeselect':
                    break;
                case 'autoScroll':
                    focused.setAutoScroll(value);
                    break;
                case 'animCollapse':
                    focused.animCollapse = value;
                    break;
                case 'bodyPadding':
                    setPadding(focused.body, value);
                    break;
                case 'columnLines':
                    focused.columnLines = value;
                    break;
                case 'collapsible':
                    var collapseTool = componentName == 'fieldset' ? focused.toggleCmp : focused.tools['collapse-top'];
                    if (value) {
                        collapseTool.show();
                    } else {
                        collapseTool.hide();
                    }
                    break;
                case 'closable':
                    var closeTool = componentName == 'newtab' ? focused.tab.closeEl : focused.tools['close'];
                    if (value) {
                        closeTool.show();
                    } else {
                        closeTool.hide();
                    }
                    break;
                case 'constrain':
                    focused.constrain = value;
                    break;
                case 'disabled':
                    break;
                case 'disableSelection':
                    break;
                case 'draggable':
                    break;
                case 'dock':
                    focused.setDocked(value, true);
                    break;
                case 'enableColumnMove':
                    break;
                case 'header':
                    if (value) {
                        focused.getHeader().show();
                    } else {
                        focused.getHeader().hide();
                    }
                    break;
                case 'hidden':
                    if (value) {
                        focused.hide();
                    } else {
                        focused.show();
                    }
                    break;
                case 'hideHeaders':
                    break;
                case 'height':
                    focused.setHeight(value);
                    break;
                case 'icon':
                    focused.setIcon(value);
                    break;
                case 'margin':
                    setMargin(focused.getEl(), value);
                    break;
                case 'maxWidth':
                    focused.maxWidth = value;
                    break;
                case 'minWidth':
                    focused.minWidth = value;
                    break;
                case 'maxHeight':
                    focused.maxHeight = value;
                    break;
                case 'minHeight':
                    focused.minHeight = value;
                    break;
                case 'maximizable':
                    if (value) {
                        focused.tools['maximize'].show();
                    } else {
                        focused.tools['maximize'].hide();
                    }
                    break;
                case 'minimizable':
                    if (value) {
                        focused.tools['minimize'].show();
                    } else {
                        focused.tools['minimize'].hide();
                    }
                    break;
                case 'modal':
                    break;
                case 'resizable':
                    break;
                case 'rowLines':
                    focused.rowLines = value;
                    break;
                case 'scale':
                    if (!Ext.Array.contains(focused.allowedScales, value)) {
                        console.log(componentName + ' "scale" property change error. Scale must be an allowed scale (' + focused.allowedScales.join(', ') + ')');
                    } else {
                        focused.setScale(value);
                    }
                    break;
                case 'title':
                    focused.setTitle(value);
                    break;
                case 'text':
                    focused.setText(value);

                    focused.setMargin(value);
                    break;
                case 'tooltip':
                    focused.setTooltip(value);
                    break;
                case 'width':
                    focused.setWidth(value);
                    break;
                default:
                    break;
            }
            if (componentName != 'button') {
                focused.doLayout();
            }
        }

        // refresh layout for all components on form
        form.doLayout();
    },

    /**
     * ������� ��������� ������ ����������� ��� ������ ���� �����������
     * @param grid ������� "��� �����������"
     */
    onComponentGroupChange: function (grid) {
        var _this = this;
        var win = grid.view.up('window');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var componentsGrid = win.down('gridpanel[name=components]');
        var selectedGroup = componentGroupGrid.getSelectionModel().getSelection()[0];

        componentsGrid.store.clearFilter();
        if (!Ext.isEmpty(selectedGroup)) {
            if (selectedGroup.get('ControlTypeGroupID') != -1) {
                componentsGrid.store.filter('ControlTypeGroupID', selectedGroup.get('ControlTypeGroupID'));
            }
        } else {
            componentsGrid.store.filter('ControlTypeGroupID', 0);
        }
    },

    /**
     * ������� ������������ ������ ��� �����������
     * @param textfield ��������� ���� �������
     */
    onContextSearch: function (textfield) {
        var win = textfield.up('window');
        var componentsGrid = win.down('gridpanel[name=components]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();
        componentsGrid.getStore().filterBy(function (record) {
            var component = record.get('component').toUpperCase().trim();
            return pattern == '' || component.indexOf(pattern) >= 0;
        });
    },

    /**
     * ������� ������������ ������ ��� �������
     * @param textfield ��������� ���� �������
     */
    onContextPropertySearch: function (textfield) {
        var win = textfield.up('window');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();
        propertiesGrid.getStore().filterBy(function (record) {
            var component = record.get('name').toUpperCase().trim();
            return pattern == '' || component.indexOf(pattern) >= 0;
        });
    },

    /**
     * �������, ����������� ������ "����������" � "��������� �������"
     * @param win ���� ��������� ����
     */
    setEnabledComponents: function (win) {
        var componentsPanel = win.down('panel[name=componentsPanel]');
        var projectPanel = win.down('panel[name=projectPanel]');
        componentsPanel.setDisabled(false);
        projectPanel.setDisabled(false);
    },

    /**
     * ������� ��������� ������� � ����������
     * @param btn ������ "����������", ��������� �������
     */
    onShowEvent: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var eventsGrid = win.down('gridpanel[name=events]');
        var selected = eventsGrid.getSelectionModel().getSelection()[0];
        if (!selected) {
            WebSystemsBuilder.utils.MessageBox.show('�������� �������.', null, -1);
            return;
        }
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.EventAction');
        var eventAction = WebSystemsBuilder.utils.Windows.open('EventAction', {
            form: form,
            isShowOnly: true,
            actions: selected.get('actions')
        }, null, true);
    },

    /**
     * ������� �������������� ������� � ����������
     * @param btn ������ "�������������", ��������� �������
     */
    onEditEvent: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var eventsGrid = win.down('gridpanel[name=events]');
        var selected = eventsGrid.getSelectionModel().getSelection()[0];
        if (!selected) {
            WebSystemsBuilder.utils.MessageBox.show('�������� �������.', null, -1);
            return;
        }
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.EventAction');
        var eventAction = WebSystemsBuilder.utils.Windows.open('EventAction', {
            form: form,
            isShowOnly: false,
            actions: selected.get('actions')
        }, null, true);
        eventAction.on('EventActionIsReadyToSave', function (winDialog, action) {
            // �������� ����
            selected.set('actions', action);
            selected.commit();
            // ������� ������� �� ���������
            eventsGrid.fireEvent('RecordChanged', eventsGrid);
        });
    },

    /**
     * ������� �������� ������� � ����������
     * @param btn ������ "�������", ��������� �������
     */
    onDeleteEvent: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var eventsGrid = win.down('gridpanel[name=events]');
        var selected = eventsGrid.getSelectionModel().getSelection()[0];
        if (!selected) {
            WebSystemsBuilder.utils.MessageBox.show('�������� �������.', null, -1);
            return;
        }
        WebSystemsBuilder.utils.MessageBox.question('�������� ���������� �������' + (selected.get('name') ? (' "' + selected.get('name') + '"') : '') + '?', function (res) {
            if (res == 'yes') {
                // �������� ����
                selected.set('actions', null);
                selected.commit();
                // ������� ������� �� ���������
                eventsGrid.fireEvent('RecordChanged', eventsGrid);
            }
        }, Ext.Msg.YESNO);
    },

    /**
     * ������� �������������� ������� � �������� ���������� ����
     * @param btn ������ "���������"
     */
    onFormParams: function (btn) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (!win.form_id) {
            WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.FormParameters');
            var paramsForm = WebSystemsBuilder.utils.Windows.open('FormParameters', {
                inParams: win.inParams,
                outParams: win.outParams,
                form: form
            }, null, true);
            paramsForm.on('ParamsAreReadyToSave', function (winParams, inParams, outParams) {
                win.inParams = inParams;
                win.outParams = outParams;
            });
        } else {
            console.log('���������� ������ ��������� ����� ����������� �����.');
        }
    },

    /**
     * ������� ������� ����� ������������ ���������.
     * @param btn ������ "�������", ��������� ������� �������� �����
     */
    onClose: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        if (win.form_name || win.form_id) {
            WebSystemsBuilder.utils.MessageBox.question('��������� ����� ' + (win.form_name ? ('"' + win.form_name + '"') : '') + '?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res, true);
                } else if (res == 'no') {
                    win.close();
                } else {
                    return;
                }
            }, Ext.Msg.YESNOCANCEL);
        } else {
            win.close();
        }
    }

});
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

    init: function () {
        this.control({
            'MainIDE': {
                afterrender: this.onLoad,
                IDEComponentFocused: this.onIDEComponentFocused
            },
            'MainIDE form[name=mainPanel]': {
                render: this.onMainPanelRender
            },
            'MainIDE menuitem[action=onSaveForm], button[action=onSaveForm]': {
                click: function (btn) {
                    this.onSaveForm(btn, false);
                }
            },
            'MainIDE menuitem[action=onNewForm], button[action=onNewForm]': {
                click: this.onCreateNewForm
            },
            'MainIDE menuitem[action=onOpenForm], button[action=onOpenForm]': {
                click: this.onOpenFormQuestion
            },
            'MainIDE menuitem[action=onRefactorForm]': {
                click: this.onRefactorForm
            },
            'MainIDE button[action=onCode]': {
                click: this.onCode
            },
            'MainIDE button[action=onDesign]': {
                click: this.onDesign
            },
            'MainIDE gridpanel[name=componentsGroups]': {
                selectionchange: function (selModel) {
                    this.onContextControlSearch(selModel.view.up('window'));
                }
            },
            'MainIDE textfield[name=filter]': {
                change: function (textfield) {
                    this.onContextControlSearch(textfield.up('window'));
                }
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

    onIDEComponentFocused: function (win, focusedComponent) {
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var propertiesOwner = win.down('panel[name=propertiesOwner]');
        var tree = win.down('treepanel');

        if (focusedComponent) {
            Focused.setFocusedCmp(focusedComponent);
            propertiesOwner.update(
                    '<span style="margin:3px;position:absolute;">' +
                    CommonUtils.renderIcon(focusedComponent.componentInfo.Icon) + '&nbsp' +
                    focusedComponent.componentInfo.Name + '&nbsp&nbsp' +
                    '<i>' + focusedComponent.componentInfo.ExtJsClass + '</i>&nbsp' +
                    '</span>'
            );

            var treeNode = tree.getRootNode().findChild('id', focusedComponent.componentInfo.uniqueID, true);
            if (treeNode) {
                tree.getSelectionModel().select(treeNode);
            }

            propertiesGrid.setSource(focusedComponent.componentInfo.Properties);
            propertiesPanel.setDisabled(false);

//            var panel = win.down('panel[name=data]');
//            var loaded1 = false, loaded2 = false;
//            if (panel.el) panel.el.mask('��������...');
//            if (focusedComponent.xtype == 'combobox') {
//                queryKeyField.show();
//            } else {
//                queryKeyField.hide();
//            }
//            var data = focusedComponent.record.get('data');
//            query.setValue(data['queryID']);
//            if (!query.getValue()) {
//                queryField.getStore().loadData([], false);
//                queryKeyField.getStore().loadData([], false);
//                if (panel.el) panel.el.unmask();
//            } else {
//                queryField.getStore().load({
//                    params: {
//                        ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
//                    },
//                    callback: function () {
//                        if (data['queryOutValueID']) queryField.setValue(data['queryOutValueID']);
//                        loaded1 = true;
//                        if (panel.el && loaded2) panel.el.unmask();
//                    }
//                });
//                queryKeyField.getStore().load({
//                    params: {
//                        ID: query.findRecordByValue(query.getValue()).get('queryTypeID')
//                    },
//                    callback: function () {
//                        if (data['queryOutKeyID']) queryKeyField.setValue(data['queryOutKeyID']);
//                        loaded2 = true;
//                        if (panel.el && loaded1) panel.el.unmask();
//                    }
//                });
//            }
//            dictionaryField.setValue(data['saveField']);
//            // �������
//            var events = focusedComponent.record.get('events');
//            eventPanel.getStore().loadData(events, false);
//        } else if (!WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp()) {
//            propertiesGrid.setSource([]);
//            propertiesGrid.customEditors = [];
//            propertiesOwner.update('');
//            propertiesFilter.setValue('');
//            tree.getSelectionModel().deselectAll();
//            propertiesPanel.setDisabled(true);
//            queryField.clearValue();
//            queryKeyField.clearValue();
//            query.clearValue();
//            dictionaryField.clearValue();
//            eventPanel.getStore().loadData([], false);
        }
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
        Ext.getBody().on('contextmenu', function (e) {
            e.preventDefault();
            var focused = Focused.getFocusedCmp();
            var moused = MousedComponentsIDE.getUpperMousedComponent();
            if (focused && moused && moused == focused) {
                var menu = ComponentFactoryUtils.getContextMenu();
                menu.down('menuitem[action=onDelete]').on('click', function () {
                    Focused.clearFocusedCmp();
                    win.fireEvent('ComponentRemoved', win, focused.up(), focused);

                    // Get factory by control type ID
                    var ControlTypeID = focused.componentInfo.ControlTypeID;
                    var factory = ComponentFactoryUtils.getFactory(ControlTypeID);
                    factory.onRemoveComponent(focused.up(), focused);
                });
                menu.showAt(e.getXY());
            }
        }, null, { preventDefault: true });

        Ext.getBody().on('click', function (e) {
            e.preventDefault();
            var focused = Focused.getFocusedCmp();
            var moused = MousedComponentsIDE.getUpperMousedComponent();
            if (moused) {
                win.fireEvent('IDEComponentFocused', win, moused);
            }
        }, null, { preventDefault: true });

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

        // disable some components on main form
        componentsPanel.setDisabled(true);
        projectPanel.setDisabled(true);
        btnDesign.toggle(true);

        // Clear some required stores
        Queries.clear();
        Random.clear();
        Focused.clearFocusedCmp();
        win.inParams = [];

        // Delegate for all components loading
        var loadControlTypeGrid = function () {
            componentsGrid.getStore().load({
                callback: function (records, objServerResponse, success) {
                    var jsonResp = Ext.decode(objServerResponse._response.responseText);
                    if (jsonResp.Code == 0) {
                        // Select "All" group
                        componentGroupGrid.getSelectionModel().select(componentGroupGrid.getStore().findRecord('ControlTypeGroupID', -1));

                    } else {
                        WebSystemsBuilder.utils.MessageBox.error(jsonResp.Message);
                    }
                },
                failure: function (objServerResponse) {
                    WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
                }
            });
        };

        // Load all groups and all components -> choose "All" in groups
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

        // Events about adding and removing components from designed form
        // Handlers shows it by adding/removing components on Project Inspector
        win.on('ComponentAdded', _this.onAddComponent);
        win.on('ComponentRemoved', _this.onRemoveComponent);
    },

    onMainPanelRender: function (form) {
        var body = form.body;
        var win = form.up('window');
        var gridComponents = win.down('gridpanel[name=components]');
        var propertiesGrid = win.down('propertygrid[name=properties]');

        form.formPanelDropTarget = new Ext.dd.DropTarget(body, {
            ddGroup: 1,
            allowDrop: true,
            notifyOver: function (ddSource, e, data) {
                var draggedCmp = ddSource.dragData.records[0];
                var draggedControlTypeID = draggedCmp.get('ControlTypeID');
                if (draggedControlTypeID == 1 && !form.down()) {
                    this.allowDrop = true;
                    return Ext.baseCSSPrefix + 'dd-drop-ok';
                } else {
                    this.allowDrop = false;
                    return Ext.baseCSSPrefix + 'dd-drop-nodrop';
                }
            },
            notifyDrop: function (ddSource, e, data) {
                if (!this.allowDrop) {
                    return false;
                }

                var draggedCmp = ddSource.dragData.records[0];
                var storeClone = CommonUtils.deepCloneStore(ddSource.view.getStore());
                var draggedClone = storeClone.findRecord('ControlTypeID', draggedCmp.get('ControlTypeID'));

                // Info about current component
                var componentInfo = {
                    ControlTypeGroupID: draggedClone.get('ControlTypeGroupID'),
                    ControlTypeID: draggedClone.get('ControlTypeID'),
                    Group: draggedClone.get('Group'),
                    Name: draggedClone.get('Name'),
                    Description: draggedClone.get('Description'),
                    ExtJsClass: draggedClone.get('ExtJsClass'),
                    Properties: draggedClone.get('Properties'),
                    PropertiesList: draggedClone.get('PropertiesList'),
                    Icon: draggedClone.get('Icon')
                };

                if (componentInfo.ControlTypeID == 1) {
                    var factory = ComponentFactoryUtils.getFactory(componentInfo.ControlTypeID);
                    var item = factory.get(win, form, componentInfo);
                    form.add(item.show());
                    win.fireEvent('ComponentAdded', win, null, item);
                    return true;
                } else {
                    return false;
                }
            }
        });
    },

    //============================================== Save designed form ==============================================

    /**
     * Save designed form
     * @param btn Button "Save"
     */
    onSaveForm: function (btn, close) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');

        if (!win.FormName) {
            var error = 'Form has not created yet.';
            WebSystemsBuilder.utils.MessageBox.error(error);
            return;
        }

        // Tree-like object 
        var obj = this.getJsonForm(form);
        if (!obj) {
            var error = 'Form is empty.';
            WebSystemsBuilder.utils.MessageBox.show(error);
            return;
        }

        var queryInParams = WebSystemsBuilder.utils.IDE.Queries.getInParams();
        var queries = WebSystemsBuilder.utils.IDE.Queries.get();

        // ����������� ������� ����������
        var orderNumber = 0;
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
                        ID: win.FormID ? win.FormID + '' : '',
                        name: win.FormName,
                        dictionaryID: win.form_dictionary_id ? win.form_dictionary_id + '' : ''
                    },
                    control: newFormObj
                }
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    // ����� ���������
                    win.FormID = jsonResp.resultID;
                    if (close) {
                        win.body.unmask();
                        win.close();
                        return;
                    }
                    // ������� ���������� � �����
                    if (form.down('[name=senchawin]')) {
                        win.fireEvent('ComponentRemoved', form, form, form.down('[name=senchawin]'));
                    }
                    form.removeAll();
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
        if (win.FormName || win.FormID) {
            WebSystemsBuilder.utils.MessageBox.question('��������� ����� "' + win.FormName + '"?', function (res) {
                if (res == 'yes') {
                    _this.onSaveForm(res);
                    _this.clearCurrentForm(form);
                    _this.onOpenForm(btn);
                } else if (res == 'no') {
                    _this.clearCurrentForm(form);
                    _this.onOpenForm(btn);
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
        openFormDialog.on('FormIsReadyToOpen', function (winDialog, formID, formName, form_dictionary_id, formDescription) {
            win.setForm(formID, formName, formDescription);
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
                id: win.FormID + ''
            },
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    var res = jsonResp.Data;
                    // ����������� ����� � ������� ����������� �������
                    _this.drawForm(win, res);
                    WebSystemsBuilder.utils.IDE.Queries.queries = res.queries;
                    query.getStore().loadData(WebSystemsBuilder.utils.IDE.Queries.get(), false);
                    win.setTitle('���������� �������� ����. ' + win.FormName);
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

    //============================================== New form ==============================================

    /**
     * Creating new form
     * If we have existing current form (not empty) - ask user "Save it before new form creation?"
     * @param btn Button/menuitem "Create new form"
     */
    onCreateNewForm: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var mainPanel = win.down('form[name=mainPanel]');
        var dictionaryField = win.down('combobox[name=dictionaryField]');
        var dictionaryFieldSet = dictionaryField.up('fieldset');

        // Delegate for new form dialog window
        var createNewForm = function () {
            // Clear current existed form on main panel
            _this.clearCurrentForm(mainPanel);

            // Open new form dialog window
            WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.CreateFormDialog');
            var createFormWin = WebSystemsBuilder.utils.Windows.open('CreateFormDialog', {}, null, true);
            createFormWin.on('FormIsReadyToCreate', function (formName, formDescription) {
                win.setForm(null, formName, formDescription);
                _this.setEnabledComponents(win);
            });
        };

        if (win.FormName || win.FormID) {
            WebSystemsBuilder.utils.MessageBox.question('Do you want to save the form "' + win.FormName + '"?',
                function (res) {
                    if (res == 'yes') {
                        _this.onSaveForm(res);
                        createNewForm();
                    } else if (res == 'no') {
                        createNewForm();
                    }
                },
                Ext.Msg.YESNOCANCEL);
        } else {
            createNewForm();
        }
    },

    //============================================== Refactor form ==============================================

    /**
     * Refactor current form
     * @param btn Button "Refactor"
     */
    onRefactorForm: function (btn) {
        var win = btn.up('window');

        if (!win.FormName) {
            var error = 'Form has not created yet.';
            WebSystemsBuilder.utils.MessageBox.error(error);
            return;
        }

        // Open window for Refactor form
        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.RefactorFormDialog');
        var refactorWin = WebSystemsBuilder.utils.Windows.open('RefactorFormDialog', {
            formID: win.FormID,
            formName: win.FormName,
            formDescription: win.FormDescription
        }, null, true);
        // Handle FormIsReadyToRename event from Refactor window
        refactorWin.on('FormIsReadyToRename', function (formName, formDescription) {
            win.setForm(win.FormID, formName, formDescription);
        });
    },

    /**
     * Show code of designed form
     * Calls getJsonForm
     * @param btn
     */
    onCode: function (btn) {
        var win = btn.up('window');
        var mainContainer = win.down('form[name=mainContainer]');
        var form = mainContainer.down('form[name=mainPanel]');
        var codeText = mainContainer.down('textareafield[name=codeText]');
        var btnLabel = win.down('button[action=onLabel]');

        if (!form.down()) {
            console.warn('Form is empty.');
            return;
        }

        // delete empty properties function
        var fnDeleteEmptyProperties = function (item) {
            for (var prop in item) {
                if (!(item[prop] instanceof Array)) {
                    var isEmpty = item[prop] == null || typeof item[prop] == 'undefined' || item[prop].toString().trim() == '';
                    var isHiddenProperties = prop == 'ControlTypeID' || prop == 'id';
                    if (isHiddenProperties) {
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

        // JSON representation of the form
        var obj = this.getJsonForm(form);
        // delete som key words and other bad things
        fnDeleteEmptyProperties(obj);

        form.hide();
        codeText.show();
        btnLabel.show();
        codeText.setValue(JSON.stringify(obj, null, '\t'));
    },

    /**
     * Show design panel
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
     * Get JSON representation of the form
     * @private
     * @param form designed form
     * @return {*} JSON representation of the form
     */
    getJsonForm: function (form) {
        var win = form.up('window');
        var localWindow = form.down();
        var availableComponents = [
            'button', 'combobox', 'container', 'datecolumn', 'datefield', 'fieldset',
            'gridcolumn', 'gridpanel', 'numbercolumn', 'numberfield',
            'panel', 'tab', 'tabpanel', 'textfield', 'toolbar'
        ];

        var getDefaultValue = function(componentInfo, stringProperty) {
            var defaultValue = null;
            componentInfo.PropertiesList.forEach(function(property) {
                if (stringProperty == property.PropertyType.Name) {
                    defaultValue = property.ControlTypePropertyType.DefaultValue;
                }
            });
            if (defaultValue == null || typeof defaultValue === 'undefined') {
                defaultValue = '';
            }
            return defaultValue + '';
        };
        var fn = function (item) {
            if (item == null || typeof item == 'undefined') {
                return null;
            }

            var items = [];
            var dockedItems = [];
            if (item.query) {
                var query = item.query('> component');
                if (item.xtype == 'gridpanel') {
                    query = query.concat(item.columnManager.columns);
                }
                // query all children
                query.forEach(function (child) {
                    if (child && child.xtype && Ext.Array.contains(availableComponents, child.xtype) && child.name && child.name.startsWith('sencha')) {
                        if (child.xtype == 'toolbar') {
                            dockedItems.push(child);
                        } else {
                            items.push(child);
                        }
                    }
                });
            }

            // create obj
            var componentInfo = JSON.parse(JSON.stringify(item.componentInfo));
            var obj = componentInfo.Properties;

            // Delete default properties
            for (var prop in obj) {
                var currentValue = obj[prop];
                if (currentValue == null || typeof currentValue === 'undefined') {
                    currentValue = '';
                }
                currentValue += '';
                if (!(currentValue instanceof Array) && prop != 'xtype') {
                    var defaultValue = getDefaultValue(componentInfo, prop);
                    if (currentValue == defaultValue) {
                        delete obj[prop];
                    }
                }
            }

//            var data = JSON.parse(JSON.stringify(item.record.get('data')));
//            var events = JSON.parse(JSON.stringify(item.record.get('events')));
//            obj.id = item.componentInfo.uniqueID;
//            obj.data = data;
//            obj.events = events;

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

        if (form.down()) {
            win.fireEvent('ComponentRemoved', form, form, form.down());
        }
        form.removeAll();
        Queries.clear();
        Random.clear();
        win.inParams = [];
        win.setForm(null, null, null);
    },

    /**
     * Add new component into Project Inspector
     * @param win Main window
     * @param parent Parent node to add new node
     * @param addedItem Child node to add
     */
    onAddComponent: function (win, parent, addedItem) {
        var tree = win.down('treepanel');
        var parentNode = null;

        if (parent) {
            if (parent.componentInfo) {
                parentNode = tree.getRootNode().findChild('id', parent.componentInfo.uniqueID, true);
            } else {
                console.log('Adding node error. "componentInfo" property is unavailable.');
            }
        }
        // If current component - main window
        if (!parentNode && addedItem.componentInfo.ControlTypeID == 1) {
            parentNode = tree.getRootNode();
        }
        if (parentNode) {
            var newNode = {
                text: addedItem.componentInfo.Name,
                name: addedItem.componentInfo.Name,
                expanded: true,
                id: addedItem.componentInfo.uniqueID,
                icon: addedItem.componentInfo.Icon,
                children: []
            };
            parentNode.appendChild(newNode, false, true);
        } else {
            console.log('Adding node error. Can\'t find parent node: ' + parent);
        }
    },

    /**
     * Remove component from Project Inspector
     * @param win Main window
     * @param parent Parent node to remove the node
     * @param removedItem Child node to remove
     */
    onRemoveComponent: function (win, parent, removedItem) {
        var tree = win.down('treepanel');
        var form = win.down('form[name=mainPanel]');

        var parentNode = null;
        if (parent.componentInfo) {
            parentNode = tree.getRootNode().findChild('id', parent.componentInfo.uniqueID, true);
        } else {
            console.log('Removing node error. "componentInfo" property is unavailable.');
        }
        var removedNode = null;
        if (removedItem.componentInfo) {
            removedNode = tree.getRootNode().findChild('id', removedItem.componentInfo.uniqueID, true);
        } else {
            console.log('Removing node error. "componentInfo" property is unavailable.');
        }

        if (!parentNode && removedItem.componentInfo.ControlTypeID == 1) {
            parentNode = tree.getRootNode()
        }
        if (!parentNode) {
            console.log('Removing node error. Can\'t find parent node: ' + parent);
        } else if (!removedNode) {
            console.log('Removing node error. Can\'t find node to remove : ' + removedItem);
        } else {
            parentNode.removeChild(removedNode);
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
        var store = CommonUtils.deepCloneStore(components.getStore());
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
            var selectedRecord = store.findRecord('Name', controlType.toLowerCase());
            var item;
            // ������� ������ � ������� ������ ��������
            if (xtype == 'container') {
                item = eval('ContainerFactory.get(win, parent, selectedRecord, layout);');
            } else {
                item = eval(CommonUtils.capitalizeFirstLetter(controlType.toLowerCase()) + 'Factory.get(win, parent, selectedRecord);');
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
            win.fireEvent('ComponentAdded', win, parent, item);
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
     * Change any property in propertygrid
     * @param source The source data object for the grid (corresponds to the same object passed in as the source config property).
     * @param recordId The record's id in the data store
     * @param value The current edited property value
     * @param oldValue The original property value prior to editing
     * @param eOpts The options object passed to Ext.util.Observable.addListener.
     */
    onProperyChange: function (source, recordId, value, oldValue, eOpts) {
        var focused = Focused.getFocusedCmp();
        var win = focused.up('window[name=MainIDE]');
        var form = win.down('form[name=mainPanel]');

        focused.componentInfo.Properties[recordId] = value;
        var componentName = focused.componentInfo.Name.toLowerCase();

        // ����
        var someComponentsArray = ['textfield', 'datefield', 'numberfield', 'combobox'];
        if (Ext.Array.contains(someComponentsArray, componentName)) {
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
                    ComponentFactoryUtils.setMargin(focused.getEl(), value);
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
                case 'valueField':
                    break;
                case 'width':
                    focused.setWidth(value);
                    break;
                default:
                    break;
            }
        }

        var someComponentsArray = ['gridcolumn', 'datecolumn', 'numbercolumn'];
        if (Ext.Array.contains(someComponentsArray, componentName)) {
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
        }

        var someComponentsArray = ['window', 'panel', 'tabpanel', 'newtab', 'gridpanel', 'toolbar', 'container (hbox)',
            'container (vbox)', 'fieldset' , 'button'];
        if (Ext.Array.contains(someComponentsArray, componentName)) {
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
                    ComponentFactoryUtils.setPadding(focused.body, value);
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
                    ComponentFactoryUtils.setMargin(focused.getEl(), value);
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
        }

        Ext.Component.updateLayout(focused);
        Ext.Component.updateLayout(form);
    },

    /**
     * Filter all components by context search and group
     * @param win Main IDE window
     */
    onContextControlSearch: function (win) {
        var controlFilter = win.down('textfield[name=filter]');
        var componentsGrid = win.down('gridpanel[name=components]');
        var componentGroupGrid = win.down('gridpanel[name=componentsGroups]');
        var selectedGroup = componentGroupGrid.getSelectionModel().getSelection()[0];
        var pattern = (controlFilter.getValue() || '').toUpperCase().trim();

        componentsGrid.store.clearFilter();
        componentsGrid.store.filterBy(function (record) {
            var component = record.get('Name').toUpperCase().trim();
            var contextSearchFilter = pattern == '' || component.indexOf(pattern) >= 0;
            var groupFilter = false;
            if (!Ext.isEmpty(selectedGroup)) {
                if (selectedGroup.get('ControlTypeGroupID') != -1) {
                    groupFilter = record.get('ControlTypeGroupID') == selectedGroup.get('ControlTypeGroupID');
                } else {
                    groupFilter = true;
                }
            }
            return contextSearchFilter && groupFilter;
        });
    },

    /**
     * Filter all properties by context search
     * @param textfield Context search textfield
     */
    onContextPropertySearch: function (textfield) {
        var win = textfield.up('window');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var pattern = (textfield.getValue() || '').toUpperCase().trim();

        propertiesGrid.getStore().filterBy(function (record) {
            var component = record.get('Name').toUpperCase().trim();
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

        if (!win.FormID) {
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

        if (win.FormName || win.FormID) {
            WebSystemsBuilder.utils.MessageBox.question('Do you want to save the form "' + win.FormName + '"?',
                function (res) {
                    if (res == 'yes') {
                        _this.onSaveForm(res, true);
                    } else if (res == 'no') {
                        win.close();
                    }
                },
                Ext.Msg.YESNOCANCEL);
        } else {
            win.close();
        }
    }

});
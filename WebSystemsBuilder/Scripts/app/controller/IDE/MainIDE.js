Ext.define('WebSystemsBuilder.controller.IDE.MainIDE', {
    extend: 'Ext.app.Controller',

    views: [
        'WebSystemsBuilder.view.IDE.MainIDE'
    ],

    models: [
        'WebSystemsBuilder.model.IDE.MainIDE',
        'WebSystemsBuilder.model.IDE.event.ComponentEvent',
        'WebSystemsBuilder.model.IDE.query.QueryActionDataTable'
    ],

    stores: [
        'WebSystemsBuilder.store.IDE.MainIDE',
        'WebSystemsBuilder.store.IDE.event.ComponentEvent',
        'WebSystemsBuilder.store.IDE.query.QueryActionDataTable'
    ],

    requires: [
        'WebSystemsBuilder.utils.IDE.Focused',
        'WebSystemsBuilder.utils.IDE.Random',
        'WebSystemsBuilder.utils.IDE.FormParametersIDE'
    ],

    init: function () {
        this.control({
            // Initialize form
            'MainIDE': {
                afterrender: this.onLoad,
                IDEComponentFocused: this.onIDEComponentFocused
            },
            'MainIDE form[name=mainPanel]': {
                render: this.onMainPanelRender
            },

            // Main actions buttons
            'MainIDE menuitem[action=onSaveForm], button[action=onSaveForm]': {
                click: function (btn) {
                    this.onSaveForm(btn, false);
                }
            },
            'MainIDE menuitem[action=onNewForm], button[action=onNewForm]': {
                click: this.onCreateNewForm
            },
            'MainIDE menuitem[action=onOpenForm], button[action=onOpenForm]': {
                click: this.onOpenForm
            },
            'MainIDE menuitem[action=onRefactorForm]': {
                click: this.onRefactorForm
            },

            // Code and design buttons
            'MainIDE button[action=onCode]': {
                click: this.onCode
            },
            'MainIDE button[action=onDesign]': {
                click: this.onDesign
            },

            // Form parameters
            'MainIDE button[action=onAddFormParameter]': {
                click: this.onAddFormParameter
            },
            'MainIDE button[action=onEditFormParameter]': {
                click: this.onEditFormParameter
            },
            'MainIDE button[action=onDeleteFormParameter]': {
                click: this.onDeleteFormParameter
            },

            // Control properties
            'MainIDE textfield[name=propertyFilter]': {
                change: this.onContextPropertySearch
            },
            'MainIDE propertygrid[name=properties]': {
                propertychange: this.onProperyChange
            },

            // Control events
            'MainIDE button[action=onEditEvent]': {
                click: this.onEditEvent
            },
            'MainIDE button[action=onDeleteEvent]': {
                click: this.onDeleteEvent
            },

            // other stuff
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
            'MainIDE button[action=onClose], menuitem[action=onClose]': {
                click: this.onClose
            }
        });
    },

    /**
     * Load the form
     * @param win Main window
     */
    onLoad: function (win) {
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
        var tree = win.down('treepanel');
        var btnCode = win.down('button[action=onCode]');
        var btnDesign = win.down('button[action=onDesign]');
        var btnSaveOnFile = win.down('button[action=onSaveOnFile]');
        var btnLabel = win.down('button[action=onLabel]');
        var FormParametersGrid = win.down('gridpanel[name=FormParametersGrid]');
        var EventHandlersGrid = win.down('gridpanel[name=events]');

        // Initialize click and right click events of the whole screen space
        _this.initializeClickEvents(win);

        // disable some components on main form
        componentsPanel.setDisabled(true);
        projectPanel.setDisabled(true);
        btnDesign.toggle(true);

        // Clear some required stores and classes
        RandomIDE.clear();
        Focused.clearFocusedCmp();
        FormControlsIDE.init(form);
        FormParametersIDE.init(FormParametersGrid);
        MousedComponentsIDE.clear();

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

//        eventPanel.on('RecordChanged', function (grid) {
//            var focused = WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp();
//            if (focused) {
//                var newEvents = [];
//                eventPanel.getStore().data.items.forEach(function (item) {
//                    newEvents.push(item.data);
//                });
//                focused.record.set('events', newEvents);
//            }
//        });

        // Events about adding and removing components from designed form
        // Handlers shows it by adding/removing components on Project Inspector
        win.on('ComponentAdded', _this.onAddComponent);
        win.on('ComponentRemoved', _this.onRemoveComponent);
    },

    /**
     * Initialize click and right click events of the whole screen space
     * @param win Window MainIDE
     */
    initializeClickEvents: function (win) {
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
        }, null, {preventDefault: true});

        Ext.getBody().on('click', function (e) {
            var moused = MousedComponentsIDE.getUpperMousedComponent();
            if (moused) {
                win.fireEvent('IDEComponentFocused', win, moused);
            }
        }, null, {preventDefault: true});
    },

    /**
     * Set Drag Zone to main form (Window to main form)
     * @param form Main form
     */
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
                    EventTypesList: draggedClone.get('EventTypesList'),
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

    //=============================================== Save designed form ===============================================

    /**
     * Save designed form
     * @param btn Button "Save"
     */
    onSaveForm: function (btn, closeAfterSave) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');

        if (!win.FormName) {
            var error = 'Form has not created yet.';
            MessageBox.error(error);
            return;
        }
        if (!form.down()) {
            var error = 'Form is empty.';
            MessageBox.error(error);
            return;
        }

        var formMetaDescriptions = {
            Form: {
                FormID: win.FormID,
                Name: win.FormName,
                Description: win.FormDescription
            },
            RootControl: null,
            Queries: null,
            FormParameters: FormParametersIDE.getFormParametersToSave(win.FormID),
            Events: null
        };

        // Tree-like object
        var obj = _this.getJsonForm(form);
        var getPropertyTypeInstance = function (componentInfo, stringProperty) {
            var PropertyTypeInstance = null;
            componentInfo.PropertiesList.forEach(function (property) {
                if (stringProperty == property.PropertyType.Name) {
                    PropertyTypeInstance = property;
                }
            });
            return PropertyTypeInstance;
        };
        var GetControlMetaDescriptions = function (item, parent) {
            var currentControl = {
                Control: {
                    ControlID: item.componentInfo.ControlID,
                    ControlTypeID: item.componentInfo.ControlTypeID,
                    ControlIDParent: parent ? parent.componentInfo.ControlID : null,
                    FormID: formMetaDescriptions.FormID,
                    OperandID: item.componentInfo.OperandID
                },
                ControlType: item.componentInfo.ControlType,
                Properties: [],
                ChildControls: [],
                Events: EventsIDE.getEventsWithActionByControlUniqueID(item.componentInfo.uniqueID)
            };

            for (var prop in item) {
                if (!(item[prop] instanceof Array) && !Ext.Array.contains(['componentInfo', 'uniqueID'], prop)) {
                    var propertyTypeInstance = getPropertyTypeInstance(item.componentInfo, prop);
                    if (!propertyTypeInstance) continue;
                    var currentProperty = {
                        Property: {
                            PropertyID: null,
                            ControlID: currentControl.Control.ControlID,
                            ControlTypePropertyTypeID: propertyTypeInstance.ControlTypePropertyType.ControlTypePropertyTypeID,
                            Value: item[prop]
                        },
                        ControlTypePropertyType: propertyTypeInstance.ControlTypePropertyType,
                        PropertyType: propertyTypeInstance.PropertyType,
                        ValueType: propertyTypeInstance.ValueType
                    };
                    currentControl.Properties.push(currentProperty);
                }
            }
            for (var prop in item) {
                if (Ext.Array.contains(['items', 'dockedItems'], prop)) {
                    item[prop].forEach(function (x) {
                        currentControl.ChildControls.push(GetControlMetaDescriptions(x, item));
                    });
                }
            }

            return currentControl;
        };

        // Collect all meta descriptions in objects
        var rootControl = GetControlMetaDescriptions(obj, null);
        formMetaDescriptions.RootControl = rootControl;

        win.body.mask('Saving...');
        Ext.Ajax.request({
            url: 'MainIDE/SaveMetaDescriptions',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            jsonData: {
                obj: formMetaDescriptions
            },
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    if (closeAfterSave) {
                        win.close();
                        return;
                    }

                    var formInstance = jsonResp.Data;
                    _this.openForm(win, formInstance.Form.FormID);

                } else {
                    MessageBox.error(jsonResp.Message);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                MessageBox.error(objServerResponse.responseText);
            }
        });
    },

    //=================================================== Open form ====================================================

    /**
     * Open form ("Open" button click event handler)
     * @param btn "Open" button
     */
    onOpenForm: function (btn) {
        var _this = this;
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');

        var openForm = function () {
            WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.OpenFormDialog');
            var openFormDialog = WebSystemsBuilder.utils.Windows.open('OpenFormDialog', {}, null, true);
            openFormDialog.on('FormIsReadyToOpen', function (formID) {
                _this.openForm(win, formID)
            })
        };

        if (win.FormName || win.FormID > 0) {
            WebSystemsBuilder.utils.MessageBox.question('Do you want to save the form "' + win.FormName + '"?',
                function (res) {
                    if (res == 'yes') {
                        _this.onSaveForm(res);
                        openForm();
                    } else if (res == 'no') {
                        openForm();
                    }
                }, Ext.Msg.YESNOCANCEL
            );
        } else {
            openForm();
        }
    },

    /**
     * Get form from storage and draw it
     * @param win
     * @param formID
     */
    openForm: function (win, formID) {
        var _this = this;
        var form = win.down('form[name=mainPanel]');

        // Clear form
        _this.clearCurrentForm(form);

        win.body.mask('Loading...');
        Ext.Ajax.request({
            url: 'FormMeta/GetFormMetaDescriptions',
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            params: {
                formID: formID + ''
            },
            success: function (objServerResponse) {
                win.body.unmask();
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    var formMetaDescriptions = jsonResp.Data;
                    _this.drawForm(win, formMetaDescriptions);
                    _this.setEnabledComponents(win);

                } else {
                    MessageBox.error(jsonResp.Message);
                }
            },
            failure: function (objServerResponse) {
                win.body.unmask();
                MessageBox.error(objServerResponse.responseText);
            }
        });
    },

    /**
     * Draw received form on the Main Form
     * @param win Main IDE Window
     * @param formMetaDescriptions Received meta-descriptions of the form
     */
    drawForm: function (win, formMetaDescriptions) {
        var _this = this;
        var form = win.down('form[name=mainPanel]');
        var components = win.down('gridpanel[name=components]');

        var Form = formMetaDescriptions.Form;
        var FormParameters = formMetaDescriptions.FormParameters;
        var RootControl = formMetaDescriptions.RootControl;

        win.setForm(Form.FormID, Form.Name, Form.Description);
        if (!formMetaDescriptions.RootControl) {
            console.warn('Form is empty');
            return;
        }

        if (FormParameters) {
            FormParameters.forEach(function (formParameter) {
                FormParametersIDE.addParameter(formParameter);
            });
        }

        // Recursive function - draws form, received from server
        var MetaDescriptionsToView = function (currentControlDescriptions, parentControl) {
            if (!currentControlDescriptions || !currentControlDescriptions.Control) {
                MessageBox.error('Component is empty');
                return;
            }

            var Control = currentControlDescriptions.Control;
            var ControlType = currentControlDescriptions.ControlType;
            var Properties = currentControlDescriptions.Properties;
            var ChildControls = currentControlDescriptions.ChildControls;

            // Info about current component
            var controlTypeStore = CommonUtils.deepCloneStore(components.getStore());
            var currentControlTypeRecord = controlTypeStore.findRecord('ControlTypeID', Control.ControlTypeID);
            var componentInfo = {
                ControlTypeGroupID: ControlType.ControlTypeGroupID,
                ControlTypeID: Control.ControlTypeID,
                ControlType: ControlType,
                Group: currentControlTypeRecord.get('Group'),
                Name: ControlType.Name,
                Description: ControlType.Description,
                ExtJsClass: ControlType.ExtJsClass,
                Properties: currentControlTypeRecord.get('Properties'),
                PropertiesList: currentControlTypeRecord.get('PropertiesList'),
                EventTypesList: currentControlTypeRecord.get('EventTypesList'),
                Icon: currentControlTypeRecord.get('Icon'),
                ControlID: Control.ControlID,
                OperandID: Control.OperandID
            };

            // Get factory by control type ID
            var factory = ComponentFactoryUtils.getFactory(componentInfo.ControlTypeID);
            // Get component, added into designed form
            var component = factory.addComponent(win, parentControl, componentInfo);

            Focused.setFocusedCmp(component);
            Properties.forEach(function (currentProperty) {
                if (currentProperty && currentProperty.Property &&
                    currentProperty.Property.Value != currentProperty.ControlTypePropertyType.DefaultValue) {
                    _this.onProperyChange(null, currentProperty.PropertyType.Name, currentProperty.Property.Value);
                }
            });
            Focused.clearFocusedCmp();

            // Recursion
            if (ChildControls && ChildControls instanceof Array && ChildControls.length > 0) {
                ChildControls.forEach(function (childControl) {
                    MetaDescriptionsToView(childControl, component);
                });
            }
        };

        MetaDescriptionsToView(RootControl, form);
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
     * Focus component event handler
     * @param win Main IDE Window
     * @param focusedComponent Focused component on the form
     */
    onIDEComponentFocused: function (win, focusedComponent) {
        var propertiesPanel = win.down('panel[name=propertiesPanel]');
        var propertiesFilter = propertiesPanel.down('textfield[name=propertyFilter]');
        var propertiesGrid = win.down('propertygrid[name=properties]');
        var eventsGrid = win.down('gridpanel[name=events]');
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

            var events = EventsIDE.getEventsByControlUniqueID(focusedComponent.componentInfo.uniqueID);
            eventsGrid.getStore().loadData(events, false);

        } else if (!WebSystemsBuilder.utils.IDE.Focused.getFocusedCmp()) {
            propertiesGrid.setSource([]);
            propertiesOwner.update('');
            propertiesFilter.setValue('');
            tree.getSelectionModel().deselectAll();
            propertiesPanel.setDisabled(true);
            eventsGrid.getStore().loadData([], false);
        }
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
                    var isHiddenProperties = Ext.Array.contains(['id', 'componentInfo', 'uniqueID'], prop);
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

        var getDefaultValue = function (componentInfo, stringProperty) {
            var defaultValue = null;
            componentInfo.PropertiesList.forEach(function (property) {
                if (stringProperty == property.PropertyType.Name) {
                    defaultValue = property.ControlTypePropertyType.DefaultValue;
                }
            });
            if (defaultValue == null || typeof defaultValue === 'undefined') {
                defaultValue = '';
            }
            return defaultValue + '';
        };
        var GetMetaDescriptionsRecursive = function (item) {
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

            // ID field
            obj.uniqueID = item.componentInfo.uniqueID;
            obj.componentInfo = componentInfo;

            // recursion
            if (items.length > 0) {
                if (item.xtype == 'gridpanel') {
                    obj.columns = [];
                    items.forEach(function (currentChildControl) {
                        obj.columns.push(GetMetaDescriptionsRecursive(currentChildControl));
                    });
                } else {
                    obj.items = [];
                    items.forEach(function (currentChildControl) {
                        obj.items.push(GetMetaDescriptionsRecursive(currentChildControl));
                    });
                }
            }
            if (dockedItems.length > 0) {
                obj.dockedItems = [];
                dockedItems.forEach(function (currentChildControl) {
                    obj.dockedItems.push(GetMetaDescriptionsRecursive(currentChildControl));
                });
            }

            return obj;
        };

        var obj = GetMetaDescriptionsRecursive(localWindow);
        return obj;
    },

    /**
     * Clear everything in current form
     * @param form main form
     */
    clearCurrentForm: function (form) {
        var win = form.up('window');

        if (form.down()) {
            win.fireEvent('ComponentRemoved', win, null, form.down());
        }
        form.removeAll();

        RandomIDE.clear();
        Focused.clearFocusedCmp();
        FormParametersIDE.clear();

        win.setForm(null, null, null);
    },

    //region Project tree

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
        if (parent && parent.componentInfo) {
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

    //endregion

    //=================================================== Some utilities ===============================================

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
            'container (vbox)', 'fieldset', 'button'];
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
     * Enable/disable components and proejct panel
     * @param win Main IDE Window
     */
    setEnabledComponents: function (win) {
        var componentsPanel = win.down('panel[name=componentsPanel]');
        var projectPanel = win.down('panel[name=projectPanel]');

        componentsPanel.setDisabled(false);
        projectPanel.setDisabled(false);
    },

    //region Events

    /**
     * Edit control event
     * @param btn Button "Edit event"
     */
    onEditEvent: function (btn) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var eventsGrid = win.down('gridpanel[name=events]');

        var selectedEvent = eventsGrid.getSelectionModel().getSelection()[0];
        if (!selectedEvent) {
            MessageBox.error('Choose event to edit');
            return;
        }

        WebSystemsBuilder.utils.ControllerLoader.load('WebSystemsBuilder.controller.IDE.event.EventHandler');
        var eventHandlerWin = WebSystemsBuilder.utils.Windows.open('EventHandler', {
            EventUniqueID: selectedEvent.get('EventUniqueID')
        }, null, true);
        eventHandlerWin.on('EventChanged', function () {
            win.fireEvent('IDEComponentFocused', win, Focused.getFocusedCmp());
        });
    },

    /**
     * Delete event handler
     * @param btn Button "Delete event handler"
     */
    onDeleteEvent: function (btn) {
        var win = btn.up('window');
        var form = win.down('form[name=mainPanel]');
        var eventsGrid = win.down('gridpanel[name=events]');

        var selectedEvent = eventsGrid.getSelectionModel().getSelection()[0];
        if (!selectedEvent) {
            MessageBox.error('Choose event to delete');
            return;
        }

        WebSystemsBuilder.utils.MessageBox.question('Do you want to delete handler of "' + selectedEvent.get('Name') + '" event?',
            function (res) {
                if (res == 'yes') {
                    selectedEvent.set('actions', null);
                    selectedEvent.commit();

                    eventsGrid.fireEvent('RecordChanged', eventsGrid);
                }
            },
            Ext.Msg.YESNO
        );
    },

    //endregion

    //region Form parameters

    /**
     * Add form parameter. Uses FormParametersIDE as parameters storage
     * @param button Button "Add form parameter"
     */
    onAddFormParameter: function (button) {
        var MainIDE = button.up('MainIDE');
        var FormParametersGrid = MainIDE.down('gridpanel[name=FormParametersGrid]');

        ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.FormParametersExplorer');
        var formParametersExplorer = WebSystemsBuilder.utils.Windows.open('FormParametersExplorer', {
            FormID: MainIDE.formID,
            UniqueID: null
        }, null, true);
//        formParametersExplorer.on('FormParameterSaved', function(parameter){
//            var formParameters = FormParametersIDE.getFormParameters();
//            FormParametersGrid.getStore().loadData(formParameters, false);
//        });
    },
    /**
     * Edit form parameter. Uses FormParametersIDE as parameters storage
     * @param button Button "Edit form parameter"
     */
    onEditFormParameter: function (button) {
        var MainIDE = button.up('MainIDE');
        var FormParametersGrid = MainIDE.down('gridpanel[name=FormParametersGrid]');
        var selectedFormParameter = FormParametersGrid.getSelectionModel().getSelection()[0];

        if (!selectedFormParameter) {
            MessageBox.error('Choose form parameter to edit');
            return;
        }

        ControllerLoader.load('WebSystemsBuilder.controller.IDE.dialog.FormParametersExplorer');
        var formParametersExplorer = WebSystemsBuilder.utils.Windows.open('FormParametersExplorer', {
            FormID: MainIDE.formID,
            UniqueID: selectedFormParameter.get('UniqueID')
        }, null, true);
//        formParametersExplorer.on('FormParameterSaved', function(parameter){
//            var formParameters = FormParametersIDE.getFormParameters();
//            FormParametersGrid.getStore().loadData(formParameters, false);
//        });
    },

    /**
     * Delete form parameter. Uses FormParametersIDE as parameters storage
     * @param button Button "Delete form parameter"
     */
    onDeleteFormParameter: function (button) {
        var MainIDE = button.up('MainIDE');
        var FormParametersGrid = MainIDE.down('gridpanel[name=FormParametersGrid]');
        var selectedFormParameter = FormParametersGrid.getSelectionModel().getSelection()[0];

        if (!selectedFormParameter) {
            MessageBox.error('Choose form parameter to delete');
            return;
        }

        WebSystemsBuilder.utils.MessageBox.question('Do you want to delete the form parameter "' + selectedFormParameter.get('Name') + '"?',
            function (res) {
                if (res == 'yes') {
                    FormParametersIDE.deleteParameter(selectedFormParameter.get('UniqueID'));
//                    var formParameters = FormParametersIDE.getFormParameters();
//                    FormParametersGrid.getStore().loadData(formParameters, false);
                }
            },
            Ext.Msg.YESNO
        );
    },

    // endregion

    /**
     * Close the window
     * @param btn Button "Close"
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
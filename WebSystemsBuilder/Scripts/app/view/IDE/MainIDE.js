Ext.define('WebSystemsBuilder.view.IDE.MainIDE', {
    extend: 'Ext.window.Window',
    alias: 'widget.MainIDE',
    name: 'MainIDE',
    autoShow: false,

    modal: true,
    constrain: true,
    title: 'IDE For Web Systems Builder',

    height: 800,
    width: 1200,
    minHeight: 800,
    minWidth: 1200,

    inParams: undefined,
    outParams: undefined,

    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;

        var controlTypeGroupStore = Ext.create('WebSystemsBuilder.store.IDE.ControlTypeGroup');
        var controlTypesStore = Ext.create('WebSystemsBuilder.store.IDE.ControlType');
        var projectInspectorStore = Ext.create('WebSystemsBuilder.store.IDE.ProjectInspector');
        var queryStore = Ext.create('WebSystemsBuilder.store.IDE.query.FormQuery');
        var queryFieldStore = Ext.create('WebSystemsBuilder.store.IDE.QueryField');
        var queryKeyFieldStore = Ext.create('WebSystemsBuilder.store.IDE.QueryField');
        var dictionaryFieldStore = Ext.create('WebSystemsBuilder.store.IDE.DictionaryField');
        var eventsStore = Ext.create('WebSystemsBuilder.store.IDE.event.ComponentEvent');

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'border',
                    items: [
//======================================================================================================================
//                                               ����������
//======================================================================================================================
                        {
                            xtype: 'panel',
                            name: 'componentsPanel',
                            title: 'Components',
                            region: 'west',
                            collapsible: true,
                            collapsed: false,
                            split: true,
                            width: 300,
                            layout: 'border',
                            items: [
//------------------------------------------------������----------------------------------------------------------------
                                {
                                    xtype: 'panel',
                                    padding: 5,
                                    region: 'north',
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            name: 'filter',
                                            emptyText: 'Filter...'
                                        }
                                    ]
                                },
//------------------------------------------------������ �����������----------------------------------------------------
                                {
                                    xtype: 'gridpanel',
                                    name: 'componentsGroups',
                                    region: 'west',
                                    split: true,
                                    width: 110,
                                    hideHeaders: true,

                                    collapsible: true,
                                    collapsed: false,
                                    collapseMode: 'mini',
                                    animCollapse: true,
                                    header: false,
                                    hideCollapseTool: true,

                                    store: controlTypeGroupStore,

                                    columns: [
                                        {
                                            flex: 1,
                                            dataIndex: 'Name'
                                        }
                                    ]
                                },
//------------------------------------------------����������------------------------------------------------------------
                                {
                                    xtype: 'gridpanel',
                                    name: 'components',
                                    region: 'center',
                                    split: true,
                                    hideHeaders: true,
                                    flex: 1,

                                    // ���� � ����
                                    enableDragDrop: true,
                                    viewConfig: {
                                        plugins: [
                                            {
                                                ptype: 'gridviewdragdrop',
                                                dragText: '{0}',
                                                dragField: 'Name',
                                                iconField: 'icon',
                                                enableDrop: false,
                                                ddGroup: 1 // window
                                            }
                                        ]
                                    },

                                    // ����� ������, ��������� dragZone
                                    store: controlTypesStore,
                                    selModel: Ext.create('Ext.selection.RowModel', { mode: "SINGLE", ignoreRightMouseSelection: true }),
                                    listeners: {
                                        beforeselect: function (_grid, record, index, eOpts) {
                                            var obj = this.getView().dragZone.groups;
                                            for (var field in obj) {
                                                this.getView().dragZone.removeFromGroup(field);
                                            }
                                            var currentControlTypeID = record.get('ControlTypeID');
                                            this.getView().dragZone.addToGroup(currentControlTypeID);
                                        }
                                    },

                                    // ������
                                    requires: [
                                        'Ext.grid.feature.Grouping'
                                    ],
                                    features: [
                                        {
                                            ftype: 'grouping',
                                            groupHeaderTpl: '{groupValue}',
                                            startCollapsed: false,
                                            id: 'componentsGrouping'
                                        }
                                    ],
                                    // �������
                                    infoIcon: 'Scripts/resources/icons/IDE/info.png',
                                    columns: [
                                        {
                                            width: 25,
                                            dataIndex: 'Icon',
                                            align: 'left',
                                            renderer: function (value) {
                                                return value ? '<img style="vertical-align: middle" src="' + value + '">' : null;
                                            }
                                        },
                                        {
                                            flex: 1,
                                            dataIndex: 'Name',
                                            renderer: function (value, metaData, record) {
                                                return '<span style="vertical-align: bottom;">' + value + '</span>';
                                            }
                                        },
                                        {
                                            width: 30,
                                            dataIndex: 'infoIcon',
                                            align: 'center',
                                            renderer: function (value, metaData, record, row, col, store, gridView) {
                                                var grid = this;
                                                var name = '<b>Component:&nbsp</b> ' + record.get('Name') + '<br>';
                                                var group = '<b>Group:&nbsp</b> ' + record.get('Group') + '<br>';
                                                var desc = '<b>Description:&nbsp</b> ' + record.get('Description') + '';
                                                metaData.tdAttr = 'data-qtip="' + name + group + desc + '"';
                                                return grid.infoIcon ? '<img style="vertical-align: middle" src="' + grid.infoIcon + '">' : null;
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
//======================================================================================================================
//                                   ������� ������
//======================================================================================================================
                        {
                            xtype: 'form',
                            name: 'mainContainer',
                            region: 'center',
                            split: true,
                            flex: 1,
                            layout: 'anchor',
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    defaults: {
                                        style: {
                                            'border-color': '#9FC6F9'
                                        }
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            scale: 'small',
                                            action: 'onLabel',
                                            text: 'Generated JSON view',
                                            hidden: true,
                                            readOnly: true,
                                            border: false
                                        },
                                        {
                                            xtype: 'tbfill'
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'small',
                                            text: 'Design',
                                            action: 'onDesign',
                                            enableToggle: true,
                                            toggleGroup: 'DesignOrCode',
                                            border: true
                                        },
                                        {
                                            xtype: 'button',
                                            scale: 'small',
                                            text: 'Code',
                                            action: 'onCode',
                                            enableToggle: true,
                                            toggleGroup: 'DesignOrCode',
                                            border: true
                                        }
                                    ]
                                }
                            ],
                            items: [
                                {
                                    xtype: 'form',
                                    name: 'mainPanel',
                                    border: false,
                                    anchor: '0 0',
                                    autoScroll: true
                                },
                                {
                                    xtype: 'textareafield',
                                    hidden: true,
                                    readOnly: true,
                                    border: false,
                                    margin: '-3 0 -3 0',
                                    fieldLabel: '',
                                    grow: true,
                                    name: 'codeText',
                                    anchor: '0 0'
                                }
                            ]
                        },

//======================================================================================================================
//                                   ��������� �������
//======================================================================================================================
                        {
                            xtype: 'panel',
                            name: 'projectPanel',
                            title: 'Project Inspector',
                            region: 'east',
                            layout: 'border',
                            split: true,
                            width: 270,
                            items: [
                                {
                                    xtype: 'treepanel',
                                    name: 'projectTree',
                                    region: 'center',
                                    split: true,
                                    useArrows: true,
                                    flex: 1,
                                    rootVisible: true,
                                    store: projectInspectorStore,
                                    listeners: {
                                        itemclick: function (tree, record, item, index, e, eOpts) {
                                            try {
                                                var name = record.get('id');
                                                var win = tree.up('window[name=MainIDE]');
                                                var form = win.down('form[name=mainPanel]');
                                                var element = form.query('component[name=' + name + ']')[0];
                                                if (element) {
                                                    Ext.FocusManager.fireEvent('componentfocus', Ext.FocusManager, element);
                                                }
                                            } catch (ex) {
                                                console.log('Tree item click error. Element to focus :' + element + ' Error info: ' + ex);
                                            }
                                        }
                                    }
                                },
//------------------------------------------------��������--------------------------------------------------------------
                                {
                                    xtype: 'panel',
                                    name: 'propertiesPanel',
                                    region: 'south',
                                    split: true,
                                    frame: false,
                                    height: 370,
                                    layout: 'anchor',
                                    items: [
                                        //------------------------------------------------������----------------------------------------------------------------
                                        {
                                            xtype: 'panel',
                                            name: 'propertiesOwner',
                                            anchor: '0',
                                            layout: 'fit',
                                            minHeight: 23,
                                            style: {
                                                background: '#dfe8f6'
                                            },
                                            bodyStyle: {
                                                'background-color': '#dfe8f6',
                                                'border-width': '0 0 1 0'
                                            }
                                        },
                                        {
                                            xtype: 'panel',
                                            padding: 5,
                                            anchor: '0',
                                            layout: 'fit',
                                            style: {
                                                background: '#dfe8f6'
                                            },
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    name: 'propertyFilter',
                                                    emptyText: 'Filter...'
                                                }
                                            ]
                                        },
                                        //------------------------------------------------���� ��������---------------------------------------------------------
                                        {
                                            xtype: 'tabpanel',
                                            activeTab: 0,
                                            anchor: '0 -57',
                                            flex: 1,
                                            name: 'propertiesTabpanel',
                                            items: [
                                                {
                                                    xtype: 'propertygrid',
                                                    name: 'properties',
                                                    title: 'Properties',
                                                    flex: 1,
                                                    bodyStyle: {
                                                        'border-width': '1 0 0 0'
                                                    },
                                                    source: {},
                                                    listeners: {
                                                        beforerender: function () {
                                                            var cols = this.getView().getHeaderCt().getGridColumns();
                                                            cols[0].setText("Property");
                                                            cols[1].setText("Value");
                                                        },
                                                        'beforeedit': {
                                                            fn: function (e) {
                                                                var readOnlyCtrls = ['name', 'id', 'xtype'];
                                                                if (Ext.Array.contains(readOnlyCtrls, e.cmp.getSelectionModel().getSelection()[0].get('name'))) {
                                                                    return false;
                                                                } else {
                                                                    return true;
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                //------------------------------------------------�������---------------------------------------------------------
                                                {
                                                    xtype: 'gridpanel',
                                                    name: 'events',
                                                    title: 'Events',
                                                    flex: 1,
                                                    bodyStyle: {
                                                        'border-width': '1 0 0 0'
                                                    },
                                                    store: eventsStore,
                                                    columns: [
                                                        {
                                                            xtype: 'gridcolumn',
                                                            flex: 1,
                                                            text: 'Event',
                                                            dataIndex: 'name'
                                                        },
                                                        {
                                                            text: 'Handler',
                                                            xtype: 'gridcolumn',
                                                            resizable: false,
                                                            dataIndex: 'hasHandler',
                                                            width: 70,
                                                            sortable: false,
                                                            renderer: function (val, meta, record) {
                                                                if (record.get('actions') && record.get('actions').length > 0) {
                                                                    return 'Yes';
                                                                } else {
                                                                    return 'No';
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    dockedItems: [
                                                        {
                                                            xtype: 'toolbar',
                                                            dock: 'right',
                                                            items: [
                                                                {
                                                                    xtype: 'button',
                                                                    scale: 'medium',
                                                                    border: true,
                                                                    icon: 'Scripts/resources/icons/find.png',
                                                                    tooltip: '���������� �������',
                                                                    action: 'onShowEvent'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    scale: 'medium',
                                                                    border: true,
                                                                    icon: 'Scripts/resources/icons/edit.png',
                                                                    tooltip: '������������� �������',
                                                                    action: 'onEditEvent'
                                                                },
                                                                {
                                                                    xtype: 'tbseparator'
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    scale: 'medium',
                                                                    border: true,
                                                                    icon: 'Scripts/resources/icons/delete.png',
                                                                    tooltip: '������� �������',
                                                                    action: 'onDeleteEvent'
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                //------------------------------------------------������---------------------------------------------------------
                                                {
                                                    xtype: 'panel',
                                                    padding: 2,
                                                    flex: 1,
                                                    title: 'Data',
                                                    name: 'data',
                                                    layout: 'anchor',
                                                    items: [
                                                        {
                                                            xtype: 'fieldset',
                                                            title: '������',
                                                            anchor: '0',
                                                            margin: 5,
                                                            padding: 2,
                                                            layout: 'anchor',
                                                            checkboxToggle: true,
                                                            items: [
                                                                {
                                                                    xtype: 'container',
                                                                    anchor: '0',
                                                                    layout: {
                                                                        align: 'stretch',
                                                                        type: 'hbox'
                                                                    },
                                                                    items: [
                                                                        {
                                                                            xtype: 'combobox',
                                                                            flex: 1,
                                                                            margin: '0 5 5 5',
                                                                            labelSeparator: '',
                                                                            valueField: '_ID',
                                                                            displayField: 'sqlText',
                                                                            queryMode: 'local',
                                                                            editable: false,
                                                                            fieldLabel: '������',
                                                                            labelWidth: 50,
                                                                            name: 'query',
                                                                            store: queryStore,
                                                                            //��������
                                                                            trigger1Cls: 'x-form-arrow-trigger',
                                                                            trigger2Cls: 'x-form-clear-trigger',
                                                                            //������� ������ �����
                                                                            onTrigger2Click: function () {
                                                                                this.clearValue();
                                                                            }
                                                                        },
                                                                        {
                                                                            xtype: 'button',
                                                                            width: 22,
                                                                            height: 22,
                                                                            action: 'onAddQuery',
                                                                            margin: '0 5 5 0',
                                                                            border: true,
                                                                            iconAlign: 'top',
                                                                            icon: 'Scripts/resources/icons/add_16.png'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    xtype: 'combobox',
                                                                    anchor: '0',
                                                                    margin: '0 5 5 5',
                                                                    labelSeparator: '',
                                                                    valueField: 'ID',
                                                                    displayField: 'name',
                                                                    queryMode: 'local',
                                                                    editable: false,
                                                                    fieldLabel: '��������',
                                                                    labelWidth: 50,
                                                                    name: 'queryField',
                                                                    store: queryFieldStore,
                                                                    //��������
                                                                    trigger1Cls: 'x-form-arrow-trigger',
                                                                    trigger2Cls: 'x-form-clear-trigger',
                                                                    //������� ������ �����
                                                                    onTrigger2Click: function () {
                                                                        this.clearValue();
                                                                    }
                                                                },
                                                                {
                                                                    xtype: 'combobox',
                                                                    anchor: '0',
                                                                    margin: '0 5 5 5',
                                                                    labelSeparator: '',
                                                                    valueField: 'ID',
                                                                    displayField: 'name',
                                                                    queryMode: 'local',
                                                                    editable: false,
                                                                    fieldLabel: '����',
                                                                    labelWidth: 50,
                                                                    hidden: true,
                                                                    name: 'queryKeyField',
                                                                    store: queryKeyFieldStore,
                                                                    //��������
                                                                    trigger1Cls: 'x-form-arrow-trigger',
                                                                    trigger2Cls: 'x-form-clear-trigger',
                                                                    //������� ������ �����
                                                                    onTrigger2Click: function () {
                                                                        this.clearValue();
                                                                    }
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            xtype: 'fieldset',
                                                            title: '�������',
                                                            anchor: '0',
                                                            layout: 'anchor',
                                                            margin: 5,
                                                            padding: 2,
                                                            checkboxToggle: true,
                                                            items: [
                                                                {
                                                                    xtype: 'combobox',
                                                                    anchor: '0',
                                                                    margin: '5 5 5 5',
                                                                    labelSeparator: '',
                                                                    valueField: 'ID',
                                                                    displayField: 'name',
                                                                    queryMode: 'local',
                                                                    editable: false,
                                                                    fieldLabel: '����',
                                                                    labelWidth: 50,
                                                                    name: 'dictionaryField',
                                                                    store: dictionaryFieldStore,
                                                                    //��������
                                                                    trigger1Cls: 'x-form-arrow-trigger',
                                                                    trigger2Cls: 'x-form-clear-trigger',
                                                                    //������� ������ �����
                                                                    onTrigger2Click: function () {
                                                                        this.clearValue();
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Form',
                                    action: 'onForm',
                                    border: true,
                                    icon: 'Scripts/resources/icons/form.png',
                                    iconAlign: 'top',
                                    width: 80,
                                    arrowAlign: 'right',
                                    menu: [
                                        {
                                            xtype: 'menuitem',
                                            action: 'onNewForm',
                                            icon: 'Scripts/resources/icons/create_16.png',
                                            border: true,
                                            iconAlign: 'left',
                                            scale: 'medium',
                                            text: 'New'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            action: 'onOpenForm',
                                            icon: 'Scripts/resources/icons/open_16.png',
                                            border: true,
                                            iconAlign: 'left',
                                            scale: 'medium',
                                            text: 'Open'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            action: 'onSaveForm',
                                            icon: 'Scripts/resources/icons/save_16.png',
                                            border: true,
                                            iconAlign: 'left',
                                            scale: 'medium',
                                            text: 'Save'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            action: 'onRefactorForm',
                                            icon: 'Scripts/resources/icons/edit_16.png',
                                            border: true,
                                            iconAlign: 'left',
                                            scale: 'medium',
                                            text: 'Refactor'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            action: 'onFormParams',
                                            icon: 'Scripts/resources/icons/up_down.png',
                                            border: true,
                                            iconAlign: 'left',
                                            scale: 'medium',
                                            text: 'Parameters'
                                        },
                                        {
                                            xtype: 'menuitem',
                                            action: 'onClose',
                                            icon: 'Scripts/resources/icons/close_16.png',
                                            border: true,
                                            iconAlign: 'left',
                                            scale: 'medium',
                                            text: 'Close'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'New Form',
                                    action: 'onNewForm',
                                    border: true,
                                    icon: 'Scripts/resources/icons/new.png',
                                    iconAlign: 'top'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Open Form',
                                    action: 'onOpenForm',
                                    border: true,
                                    icon: 'Scripts/resources/icons/open3.png',
                                    iconAlign: 'top'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Save Form',
                                    action: 'onSaveForm',
                                    border: true,
                                    icon: 'Scripts/resources/icons/save.png',
                                    iconAlign: 'top'
                                },
                                {
                                    xtype: 'tbfill'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Close',
                                    action: 'onClose',
                                    border: true,
                                    icon: 'Scripts/resources/icons/close.png',
                                    iconAlign: 'top'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.setForm = function (newFormID, newFormName, newFormDescription) {
            me.FormID = newFormID;
            me.FormName = newFormName;
            me.FormDescription = newFormDescription;
            var newTitle = 'IDE For Web Systems Builder';
            if (me.FormName) {
                newTitle += ' "' + me.FormName + '"';
            }
            me.setTitle(newTitle);
        };

        me.callParent(arguments);
    }
});
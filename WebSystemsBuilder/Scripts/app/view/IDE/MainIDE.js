Ext.define('WebSystemsBuilder.view.IDE.MainIDE', {
    extend: 'Ext.window.Window',
    alias: 'widget.MainIDE',
    name: 'MainIDE',

    modal: true,
    constrain: true,
    title: '���������� �������� ����',

    height: 800,
    width: 1200,
    minHeight: 800,
    minWidth: 1200,

    mousedComponents: [],

    form_id: undefined,
    form_name: undefined,
    form_dictionary_id: undefined,
    inParams: undefined,
    outParams: undefined,

    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;

        var componentsStore = Ext.create('WebSystemsBuilder.store.editor.Components');
        var groupsStore = Ext.create('WebSystemsBuilder.store.editor.Groups');
        var treeStore = Ext.create('WebSystemsBuilder.store.editor.TreeStore');
        var queryStore = Ext.create('WebSystemsBuilder.store.editor.query.FormQuery');
        var queryFieldStore = Ext.create('WebSystemsBuilder.store.editor.QueryField');
        var queryKeyFieldStore = Ext.create('WebSystemsBuilder.store.editor.QueryField');
        var dictionaryFieldStore = Ext.create('WebSystemsBuilder.store.editor.DictionaryField');
        var eventsStore = Ext.create('WebSystemsBuilder.store.editor.event.ComponentEvent');

        Ext.applyIf(me, {

            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: '�����',
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
                                    text: '����� �����'
                                },
                                {
                                    xtype: 'menuitem',
                                    action: 'onOpenForm',
                                    icon: 'Scripts/resources/icons/open_16.png',
                                    border: true,
                                    iconAlign: 'left',
                                    scale: 'medium',
                                    text: '������� �����'
                                },
                                {
                                    xtype: 'menuitem',
                                    action: 'onSaveForm',
                                    icon: 'Scripts/resources/icons/save_16.png',
                                    border: true,
                                    iconAlign: 'left',
                                    scale: 'medium',
                                    text: '��������� �����'
                                },
                                {
                                    xtype: 'menuitem',
                                    action: 'onRenameForm',
                                    icon: 'Scripts/resources/icons/edit_16.png',
                                    border: true,
                                    iconAlign: 'left',
                                    scale: 'medium',
                                    text: '������������� �����'
                                },
                                {
                                    xtype: 'menuitem',
                                    action: 'onFormParams',
                                    icon: 'Scripts/resources/icons/up_down.png',
                                    border: true,
                                    iconAlign: 'left',
                                    scale: 'medium',
                                    text: '��������� �����'
                                },
                                {
                                    xtype: 'menuitem',
                                    action: 'onClose',
                                    icon: 'Scripts/resources/icons/close_16.png',
                                    border: true,
                                    iconAlign: 'left',
                                    scale: 'medium',
                                    text: '�������'
                                }
                            ]
                        },
                        {
                            xtype: 'tbseparator'
                        },
                        {
                            xtype: 'button',
                            scale: 'medium',
                            text: '����� �����',
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
                            text: '������� �����',
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
                            text: '��������� �����',
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
                            text: '�������',
                            action: 'onClose',
                            border: true,
                            icon: 'Scripts/resources/icons/close.png',
                            iconAlign: 'top'
                        }
                    ]
                }
            ],

            items: [
//======================================================================================================================
//                                               ����������
//======================================================================================================================
                {
                    xtype: 'panel',
                    name: 'componentsPanel',
                    title: '����������',
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
                                    emptyText: '������...'
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

                            store: groupsStore,
                            requires: [
                                'Ext.grid.feature.Grouping'
                            ],
                            features: [
                                {
                                    ftype: 'grouping',
                                    groupHeaderTpl: '{groupValue}',
                                    startCollapsed: false,
                                    collapsible: false,
                                    id: 'groupsGrouping'
                                }
                            ],

                            columns: [
                                {
                                    flex: 1,
                                    dataIndex: 'name'
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
                                        dragField: 'component',
                                        iconField: 'icon',
                                        enableDrop: false,
                                        ddGroup: 'grid-to-window'
                                    }
                                ]
                            },

                            // ����� ������, ��������� dragZone
                            store: componentsStore,
                            selModel: Ext.create('Ext.selection.RowModel', { mode: "SINGLE", ignoreRightMouseSelection: true }),
                            listeners: {
                                beforeselect: function (_grid, record, index, eOpts) {
                                    var obj = this.getView().dragZone.groups;
                                    for (var field in obj) {
                                        this.getView().dragZone.removeFromGroup(field);
                                    }
                                    this.getView().dragZone.addToGroup('grid-to-' + record.get('component').toLowerCase());
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
                            infoIcon: 'Scripts/resources/icons/editor/info.png',
                            columns: [
                                {
                                    width: 25,
                                    dataIndex: 'icon',
                                    align: 'left',
                                    renderer: renderIcon
                                },
                                {
                                    flex: 1,
                                    dataIndex: 'component',
                                    renderer: function (val) {
                                        return '<span style="vertical-align: bottom;">' + val + '</span>';
                                    }
                                },
                                {
                                    width: 30,
                                    dataIndex: 'infoIcon',
                                    align: 'center',
                                    renderer: function (value, metaData, record, row, col, store, gridView) {
                                        var grid = this;
                                        var name = '<b>���������:&nbsp</b> ' + record.get('component') + '<br>';
                                        var group = '<b>������:&nbsp</b> ' + record.get('group') + '<br>';
                                        var desc = '<b>��������:&nbsp</b> ' + record.get('description') + '';
                                        metaData.tdAttr = 'data-qtip="' + name + group + desc + '"';
                                        return renderIcon(grid.infoIcon);
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
                                    text: '��������������� JSON �������������',
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
                                    text: '������',
                                    action: 'onDesign',
                                    enableToggle: true,
                                    toggleGroup: 'DesignOrCode',
                                    border: true
                                },
                                {
                                    xtype: 'button',
                                    scale: 'small',
                                    text: '���',
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
                            autoScroll: true,
                            listeners: {
                                render: function (form) {
                                    var _this = this;
                                    var body = form.body;
                                    var win = form.up('window');
                                    var gridComponents = win.down('gridpanel[name=components]');
                                    var propertiesGrid = win.down('propertygrid[name=properties]');
                                    _this.formPanelDropTarget = new Ext.dd.DropTarget(body, {
                                        ddGroup: 'grid-to-window',
                                        allowDrop: true,
                                        notifyOver: function (ddSource, e, data) {
                                            var isOK = true;
                                            var target = null;
                                            var draggedCmp = ddSource.dragData.records[0];
                                            if (draggedCmp.get('component').toLowerCase() == 'window' && form.down('[name=senchawin]')) {
                                                isOK = false;
                                            }
                                            if (isOK) {
                                                this.allowDrop = true;
                                                return Ext.baseCSSPrefix + 'dd-drop-ok';
                                            } else {
                                                this.allowDrop = false;
                                                return Ext.baseCSSPrefix + 'dd-drop-nodrop';
                                            }
                                        },
                                        notifyEnter: function (ddSource, e, data) {
                                            //Add some flare to invite drop.
                                            //                                        body.stopAnimation();
                                            //                                        body.highlight();
                                        },
                                        notifyDrop: function (ddSource, e, data) {
                                            if (!this.allowDrop) return false;
                                            var store = deepCloneStore(ddSource.view.getStore());
                                            var selectedRecord = store.findRecord('component', ddSource.dragData.records[0].get('component'));
                                            var item;
                                            switch (selectedRecord.get('component')) {
                                                case 'Window':
                                                    item = windowFactory(win, form, selectedRecord);
                                                    form.add(item.show());
                                                    form.doLayout();
                                                    form.fireEvent('ComponentAdded', form, form, item);
                                                    return true;
                                                default:
                                                    return false;
                                            }
                                        }
                                    });
                                } // end of render
                            } // end of listeners
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
                    title: '��������� �������',
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
                            store: treeStore,
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
                                            emptyText: '������...'
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
                                            title: '��������',
                                            flex: 1,
                                            bodyStyle: {
                                                'border-width': '1 0 0 0'
                                            },
                                            source: {},
                                            listeners: {
                                                beforerender: function () {
                                                    var cols = this.getView().getHeaderCt().getGridColumns();
                                                    cols[0].setText("��������");
                                                    cols[1].setText("��������");
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
                                            title: '�������',
                                            flex: 1,
                                            bodyStyle: {
                                                'border-width': '1 0 0 0'
                                            },
                                            store: eventsStore,
                                            columns: [
                                                {
                                                    xtype: 'gridcolumn',
                                                    flex: 1,
                                                    text: '�������',
                                                    dataIndex: 'name'
                                                },
                                                {
                                                    text: '����������',
                                                    xtype: 'gridcolumn',
                                                    resizable: false,
                                                    dataIndex: 'hasHandler',
                                                    width: 70,
                                                    sortable: false,
                                                    renderer: function (val, meta, record) {
                                                        if (record.get('actions') && record.get('actions').length > 0) {
                                                            return '����';
                                                        } else {
                                                            return '���';
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
                                            title: '������',
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
            ]
        });

        me.callParent(arguments);
    }
});
Ext.define('WebSystemsBuilder.view.IDE.event.OperandExplorer', {
    extend: 'Ext.window.Window',
    alias: 'widget.OperandExplorer',
    name: 'OperandExplorer',

    modal: true,
    constrain: true,
    title: 'Operand Explorer',

    height: 150,
    width: 500,
    minHeight: 150,
    minWidth: 500,

    layout: {
        type: 'fit'
    },
    
    includeFormParameters: true,
    includeControls: true,

    initComponent: function () {
        var me = this;

        var controlStore = Ext.create('WebSystemsBuilder.store.IDE.event.Control');
        var formParameterStore = Ext.create('WebSystemsBuilder.store.IDE.FormParameters');

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'anchor',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'right',
                            items: [
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Close',
                                    action: 'onClose',
                                    border: true,
                                    icon: 'Scripts/resources/icons/close.png',
                                    iconAlign: 'top'
                                },
                                {
                                    xtype: 'tbseparator'
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    text: 'Choose',
                                    action: 'onChoose',
                                    border: true,
                                    icon: 'Scripts/resources/icons/save.png',
                                    iconAlign: 'top'
                                }
                            ]
                        }
                    ],
                    items: [
                        {
                            xtype: 'container',
                            name: 'ControlContainer',
                            margin: '10 5 5 5',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'radiofield',
                                    boxLabel: 'Control',
                                    name: 'valueProvider',
                                    width: 110,
                                    checked: true,
                                    inputValue: 'Control',
                                    id: 'ControlValueProvider'
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'control',
                                    disabled: false,
                                    margin: '0 0 0 5',
                                    flex: 1,
                                    labelSeparator: '',
                                    valueField: 'UniqueID',
                                    displayField: 'Name',
                                    queryMode: 'local',
                                    editable: false,
                                    store: controlStore
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            name: 'ParameterContainer',
                            margin: '5 5 5 5',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'radiofield',
                                    boxLabel: 'Form Parameter',
                                    name: 'valueProvider',
                                    width: 110,
                                    inputValue: 'FormParameter',
                                    id: 'FormParameterValueProvider'
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'formParameter',
                                    disabled: true,
                                    margin: '0 0 0 5',
                                    flex: 1,
                                    labelSeparator: '',
                                    valueField: 'UniqueID',
                                    displayField: 'Name',
                                    queryMode: 'local',
                                    store: formParameterStore
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            name: 'ConstantContainer',
                            hidden: true,
                            margin: '5 5 5 5',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'radiofield',
                                    boxLabel: 'Constant',
                                    name: 'valueProvider',
                                    width: 110,
                                    inputValue: 'Constant',
                                    id: 'ConstantValueProvider'
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'constant',
                                    disabled: true,
                                    anchor: '0',
                                    margin: '0 0 0 5',
                                    flex: 1,
                                    labelSeparator: '',
                                    valueField: 'UniqueID',
                                    displayField: 'Name',
                                    queryMode: 'local',
                                    editable: false,
                                    store: controlStore
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
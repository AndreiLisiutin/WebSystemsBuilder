Ext.define('WebSystemsBuilder.utils.controlTypes.ComponentFactoryUtils', {
    alternateClassName: ['ComponentFactoryUtils'],
    singleton: true,

    afterFirstLayout: function (mainWindow, currentComponent) {
        var _this = this;
        var component = currentComponent;
        var currentComponentBody = currentComponent.body || currentComponent.el || currentComponent;
        var form = mainWindow.down('form[name=mainPanel]');

        component.formPanelDropTarget = new Ext.dd.DropTarget(currentComponentBody, {
            ddGroup: currentComponent.componentInfo.ControlTypeID,
            allowDrop: true,
            notifyOver: function (ddSource, e, data) {
                var draggedCmp = ddSource.dragData.records[0];
                var draggedControlTypeID = draggedCmp.get('ControlTypeID');
                if (MousedComponentsIDE.getMousedComponents().length > 0) {
                    var moused = MousedComponentsIDE.getMousedComponents()[0];
                    var controlTypeParentID = moused.componentInfo.ControlTypeID;
                    // Possible control types, which can be children of current moused component
                    var dragOnChildren = DragDropComponents.getDependencies(controlTypeParentID);
                    if (Ext.Array.contains(dragOnChildren, draggedControlTypeID)) {
                        this.allowDrop = true;
                        return Ext.baseCSSPrefix + 'dd-drop-ok';
                    }
                }

                this.allowDrop = false;
                return Ext.baseCSSPrefix + 'dd-drop-nodrop';
            },
            notifyDrop: function (ddSource, e, data) {
                if (!this.allowDrop || MousedComponentsIDE.getMousedComponents().length == 0) {
                    return false;
                }

                var mousedComponent = MousedComponentsIDE.getMousedComponents()[0];
                var draggedCmp = ddSource.dragData.records[0];
                // Info about current component
                var componentInfo = {
                    ControlTypeGroupID: draggedCmp.get('ControlTypeGroupID'),
                    ControlTypeID: draggedCmp.get('ControlTypeID'),
                    Group: draggedCmp.get('Group'),
                    Name: draggedCmp.get('Name'),
                    Description: draggedCmp.get('Description'),
                    ExtJsClass: draggedCmp.get('ExtJsClass'),
                    Icon: draggedCmp.get('Icon')
                };

                // Get factory by control type ID
                var factory = _this.getFactory(componentInfo.ControlTypeID);
                // Get component, added into designed form
                var component = factory.addComponent(mainWindow, mousedComponent, componentInfo);

                return true;
            }
        });

        var currentControlTypeID = currentComponent.componentInfo.ControlTypeID;
        var dependenciesOfCurrentControl = DragDropComponents.getDependencies(currentControlTypeID);

        component.formPanelDropTarget.removeFromGroup(currentControlTypeID);
        dependenciesOfCurrentControl.forEach(function (_controlTypeID) {
            component.formPanelDropTarget.addToGroup(_controlTypeID);
        });
    },

    getContextMenu: function () {
        return new Ext.menu.Menu({
            items: [
                {
                    xtype: 'menuitem',
                    icon: 'Scripts/resources/icons/delete_16.png',
                    border: true,
                    iconAlign: 'left',
                    scale: 'medium',
                    action: 'onDelete',
                    text: 'Delete'
                }
            ]
        });
    },

    setMargin: function (obj, value) {
        if (!value || value.toString().trim() == '') {
            obj.setStyle({'margin': '0px'});
            return;
        }
        var array = value.split(' ');
        if (!array || array.length != 1 && array.length != 4) {
            console.log('Margin of ' + obj.record.get('Name').toLowerCase() + ' is incorrect. (Margin = [' + value + ']).');
            return;
        }

        if (array.length == 1) {
            if (!isNumber(array[0])) {
                console.log('Margin of ' + obj.record.get('Name').toLowerCase() + ' is incorrect. (Margin = [' + value + ']).');
            } else {
                obj.setStyle({'margin': array[0] + 'px'});
            }
        } else {
            for (var i = 0; i < 4; i++) {
                if (!isNumber(array[i])) {
                    console.log('Margin of ' + obj.record.get('Name').toLowerCase() + ' is incorrect. (Margin = [' + value + ']).');
                    return;
                }
            }
            obj.setStyle({'margin-top': array[0] + 'px'});
            obj.setStyle({'margin-right': array[1] + 'px'});
            obj.setStyle({'margin-bottom': array[2] + 'px'});
            obj.setStyle({'margin-left': array[3] + 'px'});
        }
    },

    setPadding: function (obj, value) {
        if (!value || value.toString().trim() == '') {
            obj.setStyle({'padding': '0px'});
            return;
        }
        var array = value.split(' ');
        if (!array || array.length != 1 && array.length != 4) {
            console.log('Padding of ' + obj.record.get('Name').toLowerCase() + ' is incorrect. (Padding = [' + value + ']).');
            return;
        }

        if (array.length == 1) {
            if (!isNumber(array[0])) {
                console.log('Padding of ' + obj.record.get('Name').toLowerCase() + ' is incorrect. (Padding = [' + value + ']).');
            } else {
                obj.setStyle({'padding': array[0] + 'px'});
            }
        } else {
            for (var i = 0; i < 4; i++) {
                if (!isNumber(array[i])) {
                    console.log('Padding of ' + obj.record.get('Name').toLowerCase() + ' is incorrect. (Padding = [' + value + ']).');
                    return;
                }
            }
            obj.setStyle({'padding-top': array[0] + 'px'});
            obj.setStyle({'padding-right': array[1] + 'px'});
            obj.setStyle({'padding-bottom': array[2] + 'px'});
            obj.setStyle({'padding-left': array[3] + 'px'});
        }
    },

    getFactory: function (controlTypeID) {
        var factoryName = null;
        var layout = null;

        switch (controlTypeID) {
            case 1:
                factoryName = 'WindowFactory';
                break;
            case 2:
                factoryName = 'ContainerFactory';
                layout = 'hbox';
                break;
            case 3:
                factoryName = 'FieldSetFactory';
                break;
            case 4:
                factoryName = 'ToolbarFactory';
                break;
            case 5:
                factoryName = 'PanelFactory';
                break;
            case 6:
                factoryName = 'TabPanelFactory';
                break;
            case 7:
                factoryName = 'TabFactory';
                break;
            case 8:
                factoryName = 'GridPanelFactory';
                break;
            case 9:
                factoryName = 'GridColumnFactory';
                break;
            case 10:
                factoryName = 'DateColumnFactory';
                break;
            case 11:
                factoryName = 'NumberColumnFactory';
                break;
            case 12:
                factoryName = 'TextFieldFactory';
                break;
            case 13:
                factoryName = 'DateFieldFactory';
                break;
            case 14:
                factoryName = 'NumberFieldFactory';
                break;
            case 15:
                factoryName = 'ComboBoxFactory';
                break;
            case 16:
                factoryName = 'ButtonFactory';
                break;
            case 19:
                factoryName = 'ContainerFactory';
                layout = 'vbox';
                break;
        }

        var factory = Ext.create(factoryName);
        if (layout) {
            factory.layout = layout;
        }
        return factory;
    }
});
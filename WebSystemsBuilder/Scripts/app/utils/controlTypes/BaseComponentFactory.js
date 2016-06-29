Ext.define('WebSystemsBuilder.utils.controlTypes.BaseComponentFactory', {
    alternateClassName: ['BaseComponentFactory'],

    focusEvent: 'focus',
    isDocked: false,
    isColumn: false,

    addComponent: function(win, parentComponent, componentInfo) {
        var component = this.get(win, parentComponent, componentInfo);

        if (this.isDocked) {
            parentComponent.addDocked(component);
        } else if (this.isColumn) {
            parentComponent.headerCt.insert(parentComponent.columns.length, component);
            parentComponent.getView().refresh();
        } else {
            parentComponent.add(component);
        }

        win.fireEvent('ComponentAdded', win, parentComponent, component);
        return component;
    },

    get: function (win, parentComponent, componentInfo) {
        var _this = this;
        var body = parentComponent.body || parentComponent;
        var form = win.down('form[name=mainPanel]');
        var propertiesGrid = win.down('propertygrid[name=properties]');

        var component = _this.createComponent();

        component.uniqueID = Random.get();
        componentInfo.uniqueID = component.uniqueID;
        component.name = 'sencha' + componentInfo.Name.toLowerCase() + component.uniqueID;
        component.dataIndex = component.name;
        component.componentInfo = componentInfo;
        component.focusable = true;
        component.tabIndex = -1;

        var focusEventElement = _this.getFocusEventElement(component);

        component.on('afterrender', function (currentComponent) {
            var focusedCmp = Focused.getFocusedCmp();
            if (focusedCmp && focusedCmp.name == currentComponent.name) {
//                propertiesGrid.setSource(currentComponent.record.get('properties'));
            }
//            componentInfo.set('name', currentComponent.name);

            var mouseEventsEl = _this.getMouseEventsElement(currentComponent);
            mouseEventsEl.on('mouseover', function () {
                MousedComponentsIDE.pushMousedComponent(currentComponent);
            });
            mouseEventsEl.on('mouseout', function () {
                MousedComponentsIDE.popMousedComponent(currentComponent);
            });
            focusEventElement.on('contextmenu', function (e) {
                var focused = Focused.getFocusedCmp();
                if (focused && focused.componentInfo.Name.toLowerCase() == currentComponent.componentInfo.Name
                    && focused.name == currentComponent.name) {
                    var menu = ComponentFactoryUtils.getContextMenu();
                    menu.down('menuitem[action=onDelete]').on('click', function () {
                        Focused.clearFocusedCmp();
                        win.fireEvent('ComponentRemoved', win, parentComponent, currentComponent);
                        _this.onRemoveComponent(parentComponent, currentComponent);
                    });
                    menu.showAt(e.getXY());
                }
            });
        });

        component.on('resize', function (item, width, height, eOpts) {
//            item.componentInfo.Properties['width'] = width;
//            item.componentInfo.Properties['height'] = height;
//            var focusedCmp = Focused.getFocusedCmp();
//            if (focusedCmp && focusedCmp.name == item.name) {
//                propertiesGrid.setSource(item.componentInfo.Properties);
//            }
        });

        focusEventElement.on(_this.focusEvent, function (item, event, eOpts) {
            win.fireEvent('IDEComponentFocused', win, component);
        });
        component.on('render', function (item) {
            _this.onRender(win, item);
        });

        return component;
    },

    onRender: function (win, component) {
        ComponentFactoryUtils.afterFirstLayout(win, component);
    },

    onRemoveComponent: function (parentComponent, component) {
        parentComponent.remove(component, true);
    },

    createComponent: function () {
        return null;
    },

    getFocusEventElement: function (currentComponent) {
        return currentComponent;
    },

    getMouseEventsElement: function (currentComponent) {
        if (currentComponent.body) return currentComponent.body;
        if (currentComponent.el) return currentComponent.el;
        return currentComponent;
    }
});
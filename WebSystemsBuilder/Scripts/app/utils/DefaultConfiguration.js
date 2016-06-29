Ext.define('WebSystemsBuilder.utils.DefaultConfiguration', {
    singleton: true,

    setRequiredField: function (sender) {
        if (sender && sender.isFieldLabelable && sender.fieldLabel && sender.allowBlank == false) {
            sender.fieldLabel += '<span style="color:red">*</span>';
        }
    },

    iterateObjectAlphabetically: function (obj) {
        var arr = [], i;

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                arr.push(i);
            }
        }

        arr.sort();

        var res = {};
        for (i = 0; i < arr.length; i++) {
            res[arr[i]] = obj[arr[i]];
        }

        return JSON.stringify(res, null, '\t');
    },

    defineConfiguration: function () {
        var thisthis = this;

        Ext.override(Ext.resizer.Resizer, {
            transparent: true
        });

        Ext.override(Ext.view.DragZone, {
            getDragText: function () {
                if (this.dragField) {
                    var fieldValue = this.dragData.records[0].get(this.dragField);
                    var icon = this.dragData.records[0].get(this.iconField);
                    var iconValue = icon ? '<img style="vertical-align: middle" src="' + icon + '">' : '';
                    return Ext.String.format(this.dragText, '&nbsp&nbsp' + iconValue + '&nbsp&nbsp' + fieldValue);
                } else {
                    return '';
                }
            }
        });

        Ext.override(Ext.grid.plugin.DragDrop, {
            onViewRender: function (view) {
                var me = this;

                if (me.enableDrag) {
                    me.dragZone = Ext.create('Ext.view.DragZone', {
                        view: view,
                        ddGroup: me.dragGroup || me.ddGroup,
                        dragText: me.dragText,
                        dragField: me.dragField,
                        iconField: me.iconField
                    });
                    view.dragZone = me.dragZone;
                }

                if (me.enableDrop) {
                    me.dropZone = Ext.create('Ext.grid.ViewDropZone', {
                        view: view,
                        ddGroup: me.dropGroup || me.ddGroup
                    });
                    view.dragZone = me.dropZone;
                }
            }
        });

        //Ext.define('My.App.Overrides', {}, function () {
        //    Ext.require(['Ext.window.Window'], function () {
        //        Ext.window.Window.override({
        //            initDraggable: function () {
        //                this.callOverridden(arguments);
        //                Ext.Window.prototype.floating = { shadow: false };
        //                this.dd.on('drag', function () {
        //                    this.ghostPanel.setZIndex(Ext.WindowManager.getActive().getEl().dom.style.zIndex);
        //                }, this);
        //            }
        //        });
        //    });
        //});

        if (Ext.dom.Element) {
            var mask = Ext.dom.Element.prototype.mask;
            var unmask = Ext.dom.Element.prototype.unmask;
            Ext.apply(Ext.dom.Element.prototype, {
                mask: function (msg, msgCls, transparent) {
                    var _this = this;
                    if (msg) {
                        if (msg.length > 3) {
                            msg = msg.slice(0, -3) + msg.slice(-3).replaceAll('.', '').trim();
                        }
                        msg += '<span class="one">.</span><span class="two">.</span><span class="three">.</span>';
                    }
                    setTimeout(function () {
                        mask.call(_this, msg, msgCls, transparent);
                    }, 10);
                },
                unmask: function () {
                    var _this = this;
                    setTimeout(function () {
                        unmask.call(_this);
                    }, 10);
                }
            });
        }

        if (Ext.form.field.Base) {
            var _fieldConstructor = Ext.form.field.Base.prototype.constructor;
            Ext.apply(Ext.form.field.Base.prototype, {
                constructor: function (config) {
                    var _this = this;
                    _fieldConstructor.call(_this, config);

                    _this.on('beforerender', WebSystemsBuilder.utils.DefaultConfiguration.setRequiredField);

                    return _this;
                },
                labelSeparator: '',
                invalidCls: 'x-form-invalid-field',
                readOnlyCls: 'x-form-readonly'
            })
        }

        if (Ext.form.field.Trigger) {
            var _setReadOnly = Ext.form.field.Trigger.prototype.setReadOnly;
            Ext.apply(Ext.form.field.Trigger.prototype, {
                /**
                 * Пришлось переопределить переопределенный в классе Ext.form.field.Trigger метод. Он корректно расставляет css-классы для disabled-элементов,
                 * а в переопределенном виде этого нет.
                 */
                setReadOnly: function (readOnly) {
                    var _this = this;
                    readOnly = !!readOnly;
                    var result = _setReadOnly.call(_this, readOnly);
                    _this[readOnly ? 'addCls' : 'removeCls'](_this.readOnlyCls);
                    return result;
                }
            });
        }

        if (Ext.button.Button) {
            Ext.apply(Ext.button.Button.prototype, {
                listeners: {
                    afterrender: function (button) {
                        var _this = this;
                        if (button.counter) {
                            $('#' + this.id + '-btnIconEl').prepend($('<div class="button_counter">' + button.counter + '</div>'));
                        }

                        return _this;
                    }
                },
                changeCounter: function (counter) {
                    $('#' + this.id).find('.button_counter').remove();
                    if (counter)
                        $('#' + this.id + '-btnIconEl').prepend($('<div class="button_counter">' + counter + '</div>'))
                }

            });
        }

        var focusFunc = function (me, selectText, delay, callback, scope) {
            var focusTarget, focusElDom, containerScrollTop;

            if ((!me.focusable && !me.isContainer) || me.destroyed || me.destroying) {
                return;
            }

            // If delay is wanted, queue a call to this function.
            if (delay) {
                me.getFocusTask().delay(Ext.isNumber(delay) ? delay : 10, me.focus, me, [selectText, false, callback, scope]);
                return me;
            }

            // An immediate focus call must cancel any outstanding delayed focus calls.
            me.cancelFocus();

            // Assignment in conditional here to avoid calling getFocusEl()
            // if me.canFocus() returns false
            if (me.canFocus()) {
                if (focusTarget = me.getFocusEl()) {

                    // getFocusEl might return a Component if a Container wishes to delegate focus to a
                    // descendant via its defaultFocus configuration.
                    if (focusTarget.isComponent) {
                        return focusTarget.focus(selectText, delay, callback, scope);
                    }

                    focusElDom = focusTarget.dom;

                    // If it was an Element with a dom property
                    if (focusElDom) {
                        if (me.floating) {
                            containerScrollTop = me.container.dom.scrollTop;
                        }

                        // Focus the element.
                        // The Ext.event.publisher.Focus publisher listens for global focus changes and
                        // The ComponentManager responds by invoking the onFocusEnter and onFocusLeave methods
                        // of the components involved.
                        focusElDom.focus();

                        if (selectText) {
                            if (Ext.isArray(selectText)) {
                                if (me.selectText) {
                                    me.selectText.apply(me, selectText);
                                }
                            } else if (focusElDom.select) {
                                // This method both focuses and selects the element.
                                focusElDom.select();
                            } else if (me.selectText) {
                                me.selectText();
                            }
                        }

                        // Call the callback when focus is done
                        Ext.callback(callback, scope);
                    }

                    // Focusing a floating Component brings it to the front of its stack.
                    // this is performed by its zIndexManager. Pass preventFocus true to avoid recursion.
                    if (me.floating) {
                        if (containerScrollTop !== undefined) {
                            me.container.dom.scrollTop = containerScrollTop;
                        }
                    }
                }
            }
            else {
                // If we are asked to focus while not able to focus though disablement/invisibility etc,
                // focus may revert to document.body if the current focus is being hidden or destroyed.
                // This must be avoided, both for the convenience of keyboard users, and also
                // for when focus is tracked within a tree, such as below an expanded ComboBox.
                focusTarget = me.findFocusTarget();

                if (focusTarget) {
                    return focusTarget.focus(selectText, delay, callback, scope);
                }
            }

            return me;
        };

        if (Ext.toolbar.Toolbar) {
            Ext.apply(Ext.toolbar.Toolbar.prototype, {
                focus: function(selectText, delay, callback, scope) {
                    var me = this;
                    return focusFunc(me, selectText, delay, callback, scope);
                }
            });
        }
        if (Ext.grid.Panel) {
            Ext.apply(Ext.grid.Panel.prototype, {
                focus: function(selectText, delay, callback, scope) {
                    var me = this;
                    return focusFunc(me, selectText, delay, callback, scope);
                }
            });
        }

        if (Ext.form.field.ComboBox) {
            var _comboBoxConstructor = Ext.form.field.ComboBox.prototype.constructor;
            Ext.apply(Ext.form.field.ComboBox.prototype, {
                constructor: function (config) {
                    var _this = this;
                    if (config.editable && config.anyMatchOnEdit) {
                        //а это - чтоб при нажатии на триггер отображалось сразу все
                        config.onTrigger1Click = function () {
                            var store = _this.getStore();
                            store.clearFilter();
                            _this.expand();
                        };
                    }

                    if (config.allowBlank) {
                        //комбобокс очищаемый - с триггером крестик и очищаемый через Escape
                        config.trigger1Cls = config.trigger1Cls || 'x-form-arrow-trigger';
                        config.trigger2Cls = config.trigger2Cls || 'x-form-clear-trigger';
                        config.onTrigger2Click = config.onTrigger2Click || function () {
                            this.clearValue();
                        };
                        config.width = config.width ? config.width - 10 : config.width;
                        config.minWidth = config.minWidth ? config.minWidth - 10 : config.minWidth;

                        config.onEsc = config.onEsc || function (e) {
                            if (this.disabled == false && this.hidden == false && this.readOnly == false && this.onTrigger2Click) {
                                if (e.getKey() == e.ESC) {
                                    this.clearValue();
                                }
                            }
                            this.collapse();
                            e.stopEvent();
                        };
                    }

                    _comboBoxConstructor.call(_this, config);

                    if (config.editable && config.anyMatchOnEdit) {
                        //редактируемый комбобокс с фильтрацией по любому совпадению, а не только по началу
                        _this.on('change', function (combo) {
                            _this.getEl().mask('Фильтрация...');
                            setTimeout(function () {
                                var store = combo.getStore();
                                store.clearFilter();
                                if (combo.getValue()) {
                                    store.filter({
                                        property: config.displayField,
                                        anyMatch: true,
                                        value: combo.getValue()
                                    });
                                }
                                _this.getEl().unmask(true);
                            }, 100);
                        });
                    }

                    return _this;
                },
                labelSeparator: '',
                forceSelection: true,
                enableKeyEvents: true
            });
        }

        if (Ext.form.field.Date) {
            Ext.apply(Ext.form.field.Date.prototype, {
                labelSeparator: '',
                defaultFormat: "d.m.Y",
                invalidCls: 'x-form-invalid-field',

                maskRe: /[0-9.\,]/,

                setCaretPosition: function (pos) {
                    var el = this.inputEl.dom;
                    if (typeof (el.selectionStart) === "number") {
                        el.focus();
                        el.setSelectionRange(pos, pos);
                    } else if (el.createTextRange) {
                        var range = el.createTextRange();
                        range.move("character", pos);
                        range.select();
                    } else {
                        throw 'setCaretPosition() not supported';
                    }
                },

                getCaretPosition: function () {
                    var el = this.inputEl.dom;
                    if (typeof (el.selectionStart) === "number") {
                        return el.selectionStart;
                    } else if (document.selection && el.createTextRange) {
                        var range = document.selection.createRange();
                        range.collapse(true);
                        range.moveStart("character", -el.value.length);
                        return range.text.length;
                    } else {
                        throw 'getCaretPosition() not supported';
                    }
                },

                listeners: {
                    beforerender: WebSystemsBuilder.utils.DefaultConfiguration.setRequiredField,
                    change: function (sender, newValue, oldValue, eOpts) {
                        if (!newValue || !sender.hasFocus) {
                            return;
                        }

                        newValue = sender.getRawValue();
                        if (newValue.indexOf(',') != -1) {
                            newValue = newValue.replace(',', '.');
                        }
                        var caretPosition = this.getCaretPosition();

                        if (sender.format == 'd.m.Y') {
                            //точки расставляются автоматически
                            if ((newValue.length == 4 || newValue.length == 7)
                                && newValue[newValue.length - 1] == '.' && newValue[newValue.length - 2] == '.') {
                                newValue = newValue.substring(0, newValue.length - 2);
                            }

                            if (newValue.length == 2 || newValue.length == 5) {
                                newValue = newValue + '.';
                                caretPosition++;
                            }

                            //чтоб лишнего не вводили
                            if (newValue.length == 11) {
                                newValue = newValue.substring(0, newValue.length - 1);
                            }
                        }

                        sender.setRawValue(newValue);
                        this.setCaretPosition(caretPosition);
                    }
                }
            });
        }


        // Для того, чтобы можно было передавать сложные объекты в grid.getStore().load({params:...});
        //Ext.override(Ext.data.proxy.Ajax, {
        //    doRequest: function (operation, callback, scope) {
        //        var writer = this.getWriter(),
        //            request = this.buildRequest(operation, callback, scope);

        //        if (operation.allowWrite()) {
        //            request = writer.write(request);
        //        }

        //        Ext.apply(request, {
        //            headers: this.headers,
        //            timeout: this.timeout,
        //            scope: this,
        //            callback: this.createRequestCallback(request, operation, callback, scope),
        //            method: this.getMethod(request),
        //            disableCaching: false // explicitly set it to false, ServerProxy handles caching
        //        });

        //        //Added... jsonData is handled already
        //        if (this.jsonData) {
        //            request.jsonData = Ext.encode(request.params);
        //            delete request.params;
        //        }

        //        Ext.Ajax.request(request);

        //        return request;
        //    }
        //});

        if (Ext.tip.QuickTip) {
            Ext.apply(Ext.tip.QuickTip.prototype, {
                showDelay: 500,
                dismissDelay: 3000
            });
        }

        if (Ext.form.RadioGroup) {
            Ext.apply(Ext.form.RadioGroup.prototype, {
                invalidCls: 'x-form-invalid-field',
                listeners: {
                    beforerender: WebSystemsBuilder.utils.DefaultConfiguration.setRequiredField
                }
            });
        }

        if (Ext.grid.Panel) {
            var _gridPanelConstructor = Ext.grid.Panel.prototype.constructor;
            Ext.apply(Ext.grid.Panel.prototype, {
                constructor: function (config) {
                    var _this = this;
                    _gridPanelConstructor.call(_this, config);

                    return _this;
                }
            });
        }

        if (Ext.form.field.Checkbox) {
            Ext.apply(Ext.form.field.Checkbox.prototype, {
                readOnlyCls: Ext.baseCSSPrefix
            });
        }

        /**
         * Replaces all occurrences of a substring in a string
         */
        if (typeof String.prototype.replaceAll != 'function') {
            String.prototype.replaceAll = function (token, newToken) {
                return this.split(token).join(newToken);
            };
        }
        /**
         * Функция возвращает логическое значение, определяющее, начинается ли текущая строка со строки str
         * @param str Начальная подстрока для проверки
         */
        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }

        /**
         * Provides a convenient method for performing basic date arithmetic. This method
         * does not modify the Date instance being called - it creates and returns
         * a new Date instance containing the resulting date value.
         *
         * Examples:
         *
         *     // Basic usage:
         *     var dt = Ext.Date.subtract(new Date('10/29/2006'), Ext.Date.DAY, 5);
         *     console.log(dt); // returns 'Tue Oct 24 2006 00:00:00'
         *
         *     // Negative values will be added:
         *     var dt2 = Ext.Date.subtract(new Date('10/1/2006'), Ext.Date.DAY, -5);
         *     console.log(dt2); // returns 'Fri Oct 6 2006 00:00:00'
         *
         *      // Decimal values can be used:
         *     var dt3 = Ext.Date.subtract(new Date('10/1/2006'), Ext.Date.DAY, 1.25);
         *     console.log(dt3); // returns 'Fri Sep 29 2006 06:00:00'
         *
         * @param {Date} date The date to modify
         * @param {String} interval A valid date interval enum value.
         * @param {Number} value The amount to subtract from the current date.
         * @return {Date} The new Date instance.
         */
        if (!Ext.Date.subtract) {
            Ext.Date.subtract = function (date, interval, value) {
                return Ext.Date.add(date, interval, -value);
            };
        }

        if (Ext.data.Store) {
            Ext.apply(Ext.data.Store.prototype, {
                /*
                 В Ext JS метод возвращает первое совпадение (Если будет в комбо 2 итема с кодами "1" и "16" при поиске по коду 1 вернет первую встретившуюся запись)
                 Пример данных у комбо:
                 data: [
                 {
                 "id": "48",
                 "name": "Alabama"
                 },
                 {
                 "id": "4",
                 "name": "Alaska"
                 }
                 //...
                 ]
                 При поиске записи с id=4 найдется запись "48-Alabama"
                 Изменен метод, теперь он использует метод findExact, возвращающий корректную запись
                 */
                findRecord: function (field, value) {
                    var idx = this.findExact(field, value);
                    if (idx !== -1) {
                        return this.getAt(idx);
                    } else {
                        return false;
                    }
                }
            });
        }

        if (Ext.form.FieldContainer) {
            Ext.apply(Ext.form.FieldContainer.prototype, {
                labelSeparator: ' ',
                listeners: {
                    beforerender: WebSystemsBuilder.utils.DefaultConfiguration.setRequiredField
                }
            })
        }

        Ext.override(Ext.data.Connection, {
            onComplete: function (request) {
                var me = this,
                    options = request.options,
                    result,
                    success,
                    response;

                try {
                    result = me.parseStatus(request.xhr.status);
                } catch (e) {
                    result = {
                        success: false,
                        isException: false
                    };
                }
                success = result.success;

                if (success) {
                    response = me.createResponse(request);

                    var decoded = Ext.decode(response.responseText);
                    if (decoded.resultMessage != undefined) {

                        if (!me.supressAllOtherMessages) {
                            setTimeout(function () {
                                Ext.Msg.show({
                                    title: 'Сообщение',
                                    msg: decoded.resultMessage,
                                    buttons: Ext.Msg.OK,
                                    icon: Ext.Msg.WARNING,
                                    fn: fn
                                });
                            }, 100);

                            function fn(bt) {
                                if (bt == "ok") {
                                    parent.location.reload();
                                }
                            }

                            me.supressAllOtherMessages = true;
                        }

                        return;
                    }


                    me.fireEvent('requestcomplete', me, response, options);
                    Ext.callback(options.success, options.scope, [response, options]);
                } else {
                    if (result.isException || request.aborted || request.timedout) {
                        response = me.createException(request);
                    } else {
                        response = me.createResponse(request);
                    }
                    me.fireEvent('requestexception', me, response, options);
                    Ext.callback(options.failure, options.scope, [response, options]);
                }
                Ext.callback(options.callback, options.scope, [options, success, response]);
                delete me.requests[request.id];
                return response;
            }
        });
    }
});

Ext.define('WebSystemsBuilder.utils.CommonUtils', {
    alternateClassName: ['CommonUtils'],
    singleton: true,

    //Готовит объект для Post-запроса:
    //поля со значением null, undefined становятся '',
    //массивы и объекты обходятся рекурсивно,
    //примитивные поля - кроме дат - становятся строками и тримятся
    preparePostParameter: function (object) {
        if (object == null || typeof object == 'undefined') {
            object = '';
        } else if (Object.prototype.toString.call(object) === '[object Array]') {
            object.forEach(function (item) {
                item = preparePostParameter(item);
            });
        } else if (Object.prototype.toString.call(object) === '[object Object]') {
            for (var fied in object) {
                object[fied] = preparePostParameter(object[fied]);
            }
        } else if (!(object instanceof Date)) {
            object = object.toString().trim();
        }
        return object;
    },

    /**
     * Return random Int value
     * @return {Number}
     */
    getRandomInt: function () {
        return Math.floor(Math.random() * (10000000));
    },

    /**
     * Array Contains
     * @param a
     * @param obj
     * @returns {boolean}
     */
    contains: function (a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i].toLowerCase() == obj.toLowerCase()) {
                return true;
            }
        }
        return false;
    },

    /**
     * Функция для рендеринга изображения
     * @param val url изображения
     * @return {String} строка с тегом <img> дял рендеринга изображения
     */
    renderIcon: function (val) {
        if (val) return '<img style="vertical-align: middle" src="' + val + '">'; else return '';
    },

    /**
     * Deep clone store
     * @param source old Store
     * @return {*} new Store
     */
    deepCloneStore: function (source) {
        var target = Ext.create('Ext.data.Store', {
            model: source.model
        });
        Ext.each(source.getRange(), function (record) {
            var newRecordData = Ext.clone(record.copy().data);
            var model = new source.model(newRecordData, record.session);
            target.add(model);
        });
        return target;
    },

    /**
     * Function for checking on number
     * @param n
     * @returns {boolean}
     */
    isNumber: function (n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    },

    /**
     * Remove mask from GUI element
     * @param widget
     */
    safeUnmask: function (widget) {
        if (widget && widget.getEl() && widget.getEl().unmask) {
            widget.getEl().unmask(true);
        }
    },

    /**
     * Set mask on GUI element
     * @param widget
     */
    safeMask: function (widget, message) {
        if (widget && widget.getEl() && widget.getEl().mask) {
            widget.getEl().mask(message || 'Loading...');
        }
    },

    /**
     * Функция, преобразовывающая первый символ строки к Uppercase
     * @param string Строка типа "string"
     * @returns {string} Строка типа "String" */
    isArray: function (value) {
        return value && Object.prototype.toString.call(value) === '[object Array]'
    },


    capitalizeFirstLetter: function (string) {
        if (!string) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    replaceBrucket: function (string) {
        if (!string) return string;
        if (string[0] == '{') {
            return string.substring(1, string.length - 1);
        }
        return string;
    }
});
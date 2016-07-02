﻿Ext.define('WebSystemsBuilder.utils.formGeneration.FormGenerationBase', {
    singleton: true,
    requires: [
        'WebSystemsBuilder.utils.mapping.ValueTypes',
        'WebSystemsBuilder.utils.controlTypes.ComponentFactoryUtils',
        'WebSystemsBuilder.utils.operands.FormParameterHandler'
    ],

    createForm: function (formID) {
        var _this = this;
        Ext.create('WebSystemsBuilder.utils.formGeneration.Form', {
            formID: 1,
            formParameters: {
                1: 1
            }
        });
    }
});

Ext.define('WebSystemsBuilder.utils.IDE.Focused', {
    singleton: true,
    alternateClassName: ['Focused'],

    focusedCmp: null,

    init: function() {
        // Custom css "z-focused-element" for current focused component
        Ext.util.CSS.createStyleSheet('.z-focused-element ' +
                '{ ' +
                '  border-style:double ; ' +
                '  border-width:1px; ' +
                '  border-color: rgb(0,100,255); ' +
                '  -webkit-box-shadow:0px 0px 30px 0px rgb(0,100,255); ' +
                '  -moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);' +
                '  box-shadow:-moz-box-shadow:0px 0px 30px 0px rgb(0,100,255);  ' +
                '}',
            'z-focused-element'
        );
    },

    getFocusedCmp: function () {
        return this.focusedCmp;
    },

    setFocusedCmp: function (cmp) {
        this.clearFocusedCmp();
        try {
            if (cmp) {
                this.focusedCmp = cmp;
                this.focusedCmp.addCls('z-focused-element');
            }
        } catch (ex) {
            console.log('Deleted focusedCmp is empty. Error: ' + ex + ' Focused component: ' + this.focusedCmp);
        }
    },

    clearFocusedCmp: function () {
        try {
            if (this.focusedCmp) {
                this.focusedCmp.removeCls('z-focused-element');
            }
        } catch (ex) {
            console.log('Deleted focusedCmp is empty. Error: ' + ex + ' Focused component: ' + this.focusedCmp);
        }
        this.focusedCmp = null;
    }
});
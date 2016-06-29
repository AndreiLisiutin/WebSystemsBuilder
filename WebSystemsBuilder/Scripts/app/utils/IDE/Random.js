Ext.define('WebSystemsBuilder.utils.IDE.Random', {
    singleton: true,
    alternateClassName: ['Random'],

    usedNumbers: undefined,

    init:function(){
        this.usedNumbers = [];
    },

    get: function () {
        var num;
        while(true){
            num = CommonUtils.getRandomInt();
            if (!Ext.Array.contains(this.usedNumbers, num)){
                this.add(num);
                break;
            }
        }
        return num;
    },

    add: function (num) {
        this.usedNumbers.push(num);
    },

    clear: function () {
        this.usedNumbers = [];
    }
});
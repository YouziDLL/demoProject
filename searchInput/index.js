var search={
    inputDom:null,
    searchListDom:null,
    init:function (options) {
        this.initData(options.ele);
    },
    initData:function (ele) {
        this.inputDom=ele.getElementsByClassName('search-inp')[0].getElementsByTagName('input')[0];
        this.searchListDom=ele.getElementsByClassName('search-list');
    },
    handle:function () {

    },
    handleInput:function () {
        var self = this;
        this.inputDom.oninput=function (e) {
            var inputText = e.target.value.trim();
            if (inputText === self.pre)
        }
    }
};
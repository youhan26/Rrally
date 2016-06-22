/**
 * Created by YouHan on 2016/6/21.
 */
(function () {
    var api = require('./api');
    var supp = {
        isInit: false,
        load: null,
        member: [],
        project: [],
        getNameById: getbyid
    };
    var me = supp,
        max = 2;

    init();

    function init() {
        me.isInit = true;
        var index = 0;
        me.load = new Promise(function (resolve, reject) {
            api.member.get().then(function (snap) {
                me.member = snap.val();
                isload();
            });
            //TODO problem will jump into and report a error
            // .then(function (reason) {
            //     reject('load error from supporting data member', reason);
            // })

            api.project.get().then(function (snap) {
                me.project = snap.val();
                isload();
            });
            // .then(function (reason) {
            //     reject('load error from supporting data project', reason);
            // })

            function isload() {
                if (++index === max) {
                    me.isInit = false;
                    resolve();
                }
            }
        });
    }

    //if meorting data no name property, return whole data
    function getbyid(modulename, id) {
        var dataset = me[modulename];
        if (!dataset) {
            throw Error('no such module supporting data');
        }
        if (!id || typeof (parseInt(id)) !== 'number') {
            return '';
        }
        for (var i = 0, ii = dataset.length; i < ii; i++) {
            if (dataset[i] && dataset[i].id === id) {
                return dataset[i].name || dataset[i];
            }
        }
        return null;
    }

    module.exports = me;
})();
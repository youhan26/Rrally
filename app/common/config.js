/**
 * Created by YouHan on 2016/4/25.
 */

(function () {

    var host = 'https://rally-test.firebaseio.com';

    var constant = {
        host: host,
        story: host + '/story',
        index: host + '/index',
        release: host + '/release',
        bug: host + '/bug'
    };

    module.exports = constant;
})();
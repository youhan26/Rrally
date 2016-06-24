/**
 * Created by YouHan on 2016/6/12.
 */
(function () {
    var constant = require('./config');
    var firebase = require('firebase');

    var ref = new firebase(constant.host);
    var projectRef = ref.child('project');
    var memberRef = ref.child('member');
    var releaseref = ref.child('release');
    var bugref = ref.child('bug');
    var storyref = ref.child('story');


    var project = {
        get: projectget,
        update: projectupdate,
        del: projectdel,
        save: projectsave,
        updateRelease: updateRelease
    };

    var member = {
        get: memberget,
        update: memberupdate,
        del: memberdel,
        save: membersave
    };

    var release = {
        get: releaseget,
        getnext: releasegetnext,
        save: releasesave
    };

    var bug = {
        get: bugget
    };

    var story = {
        get: storyget,
        update: storyupdate
    };

    function storyget(storyid) {
        return commongetbychild(storyref, storyid);
    }

    function storyupdate(storyid, data) {
        return commonupdatebychid(storyref, storyid, data);
    }

    function bugget(id) {
        return commonget(bugref, 'id', id);
    }

    function releaseget(id) {
        return commonget(releaseref, 'id', id)
    }

    function releasesave(data) {
        return commonsave(releaseref, data)
    }

    function releasegetnext(id) {
        return commongetlistnext(releaseref, 'id', id)
    }

    function memberget(id) {
        return commonget(memberRef, 'id', id);
    }

    function memberupdate(id, source) {
        return commonupdate(memberRef, id, source);
    }

    function memberdel(id) {
        return commondel(memberRef, 'id', id);
    }

    function membersave(source) {
        return commonsave(memberRef, source);
    }

    function projectget(id) {
        return commonget(projectRef, 'id', id);
    }

    function projectupdate(id, source) {
        return commonupdate(projectRef, id, source);
    }

    function projectdel(id) {
        return commondel(projectRef, 'id', id);
    }

    function projectsave(source) {
        return commonsave(projectRef, source);
    }

    function updateRelease(data) {
        return new Promise(function (resolve, reject) {
            var s = data.releaseName;
            var index = parseInt(s.substr(s.length - 2, s.length - 1)) + 1;
            commongetbychild(releaseref, index).then(function (res) {
                var newrelease = res.val();
                if (!newrelease) {
                    newrelease = {
                        id: new Date().getTime(),
                        name: 'Release ' + index
                    };
                    release.save(newrelease);
                }
                project.update(data.id, {
                    release: newrelease.id,
                    releaseName: newrelease.name
                }).then(function (res) {
                    resolve(res);
                }).then(function (res) {
                    reject(res);
                });
            });
        });
    }


    function commonget(ref, key, value) {
        if (value) {
            return ref.orderByChild(key).equalTo(value).once('value');
        }
        return ref.once('value');
    }

    function commongetlistnext(ref, key, value) {
        return new Promise(function (resolve, reject) {
            commonget(ref, key, value).then(function (data) {
                var index = parseInt(Object.getOwnPropertyNames(data.val())[0]) + 1;
                commongetbychild(ref, index).then(function (res) {
                    resolve(res.val())
                }).then(function (reason) {
                    reject(reason)
                })
            }).then(function (reason) {
                reject(reason)
            })
        })
    }

    function commongetbychild(ref, child) {
        if (child) {
            return ref.child(child).once('value');
        }
        return ref.once('value');
    }

    function commonupdate(ref, id, source) {
        return new Promise(function (resolve, reject) {
            ref.orderByChild('id').equalTo(id).once('value').then(function (data) {
                var index = Object.getOwnPropertyNames(data.val())[0];
                ref.child(index).update(source).then(function (argumnets) {
                    resolve(argumnets);
                }).then(function () {
                    reject('update error');
                });
            });
        });
    }

    function commonupdatebychid(ref, child, data) {
        return ref.child(child).update(data);
    }

    function commondel(ref, key, value) {
        return new Promise(function (resolve, reject) {
            ref.orderByChild(key).equalTo(value).once('value').then(function (data) {
                var index = Object.getOwnPropertyNames(data.val())[0];
                ref.child(index).remove().then(function (arguments) {
                    resolve(arguments);
                }).then(function () {
                    reject('save error');
                });
            });
        });
    }

    /**
     * source need generate id self
     * @param ref
     * @param source
     * @returns {Promise}
     */
    function commonsave(ref, source) {
        return new Promise(function (resolve, reject) {
            ref.once('value').then(function (data) {
                var list = Object.getOwnPropertyNames(data.val());
                var index = parseInt(list[list.length - 2]) + 1;
                source.id = index;
                ref.child(index).set(source).then(function (arguments) {
                    resolve(arguments);
                }).then(function () {
                    reject('save error');
                });
            });
        });
    }

    module.exports = {
        project: project,
        member: member,
        release: release,
        story: story
    };
})();
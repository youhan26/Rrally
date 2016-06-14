/**
 * Created by YouHan on 2016/5/19.
 */

(function () {
    'use strict';
    var React = require('react');
    var ReactDOM = require('react-dom');
    var injectTapEventPlugin = require("react-tap-event-plugin");

    var ProjectManage = require('./project');
    var MemberManage = require('./member');

    injectTapEventPlugin();

    var manage = React.createClass({
        getInitialState: function () {
            return {}
        },
        render: function () {
            return (
                <div>
                    <ProjectManage></ProjectManage>
                    <MemberManage></MemberManage>
                </div>
            )
        }
    });

    var el = document.getElementById('manage');
    if (el) {
        ReactDOM.render(React.createElement(manage, null), el);
    }
})();
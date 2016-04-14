/**
 * Created by youha on 4/14/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');


/**
 * attachments will support the upload all kinds of file function.
 * this module will support preview function in future.
 */
// var Attachments = React.createClass({
//     render: function () {
//         return (
//             <div></div>
//         )
//     }
// });
//
//
// /**
//  * story schedule include release version, iteration and so on
//  */
// var StorySchedule = React.createClass({
//     render: function () {
//         return (
//             <div></div>
//         )
//     }
// });
//
// /**
//  * story status include schedule status, plan est, task est, to do, owner and project
//  */
// var StoryStatus = React.createClass({
//     render: function () {
//         return (
//             <div>
//             </div>
//         )
//     }
// });

/**
 * story include the base description, status, schedule and attachments
 */
var Story = React.createClass({
    displayName: 'dashboard',
    render: function () {
        return (
            <div>
                <input placeholder="please input story name"/>
                <button>Create</button>
            </div>
        )
    }
});

var el = document.getElementById('story');

ReactDOM.render(React.createElement(Story, null), el);
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
var Attachments = React.createClass({
    render: function () {
        return (
            <div></div>
        )
    }
});


/**
 * story schedule include release version, iteration and so on
 */
var StorySchedule = React.createClass({
    render: function () {
        return (
            <div></div>
        )
    }
});

/**
 * story status include schedule status, plan est, task est, to do, owner and project
 * need the story and schedule data from parent
 */

var StoryStatus = React.createClass({
    render: function () {
        return (
            <div>
                <label>SCHEDULE STATE:</label>{this.props.schedule.state}<br/>
                <label>STATUS :</label>{this.props.story.state}<br/>
                <label>PLAN EST:</label>{this.props.story.planEst}<br/>
                <label>TASK EST:</label>{this.props.story.taskEst}<br/>
                <label>TODO :</label>{this.props.story.todo}
            </div>
        )
    }
});


var schedule = {
    state: 'schedule state'
};
var story = {
    state: 'developing',
    planEst: '12',
    taskEst: '11',
    todo: '10'
};

/**
 * story include the base description, status, schedule and attachments
 */
var Story = React.createClass({
    displayName: 'story',
    render: function () {
        return (
            <div>
                <input placeholder="please input story name"/>
                <button >Create</button>
                <StoryStatus story={story} schedule={schedule}></StoryStatus>
                <h3>Description:</h3>
                <textarea row="10"></textarea>
                <h3>Notes:</h3>
                <textarea row="10"></textarea>
                <StorySchedule></StorySchedule>
                <Attachments></Attachments>
            </div>
        )
    }
});


var el = document.getElementById('story');

ReactDOM.render(React.createElement(Story, null), el);

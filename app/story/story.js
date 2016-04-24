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
    handleChange: function () {
        var ref = this.refs;
        this.props.scheduleChange(
            ref.project.value,
            ref.iteration.value,
            ref.release.value
        );
    },
    /**
     * TODO change iteration and release to select box and module
     * @returns {XML}
     */
    render: function () {
        return (
            <div>
                <section>
                    <h2>Story Schedule</h2>
                    <label>Project Name: </label>
                    <select value={this.props.schedule.project} onChange={this.handleChange}
                            ref="project">
                        <option value="rally">Rrally</option>
                        <option value="haijie">嗨街</option>
                        <option value="dsplug">DSPLUG</option>
                        <option value="social">DSPLUG-social</option>
                    </select>
                    <label>Iteration :</label>
                    <input value={this.props.schedule.iteration} onChange={this.handleChange}
                           ref="iteration"/>
                    <label>Release : </label>
                    <input value={this.props.schedule.release} onChange={this.handleChange}
                           ref="release"/>
                </section>
            </div>
        )
    }
});

/**
 * story status include schedule status, plan est, task est, to do, owner and project
 * need the story and schedule data from parent
 */

var StoryStatus = React.createClass({
    getInitialState: function () {
        return {
            planEst: 0,
            taskEst: 0,
            todo: 0
        }
    },
    handleChange: function (e) {
        this.props.statusChange(
            this.refs.plan.value,
            this.refs.task.value,
            this.refs.todo.value
        );
    },
    render: function () {
        /**
         * <label>SCHEDULE STATE:</label>{this.props.schedule.state}<br/>
         * <label>STATUS :</label>{this.props.story.state}<br/>
         */
        return (
            <div>
                <section>
                    <h2>Story Status</h2>
                    <label>PLAN EST(H):</label>
                    <input type="number" min="0" value={this.props.status.planEst}
                           ref="plan"
                           onChange={this.handleChange}/>&nbsp;&nbsp;
                    <label>TASK EST(H):</label>
                    <input type="number" min="0" value={this.props.status.taskEst}
                           ref="task"
                           onChange={this.handleChange}/>&nbsp;&nbsp;
                    <label>TODO (H):</label>
                    <input type="number" min="0" value={this.props.status.todo}
                           ref="todo"
                           onChange={this.handleChange}/>
                </section>
            </div>
        )
    }
});


var StoryBasic = React.createClass({
    click: function () {
        this.props.onCreate({
            name: this.refs.name.value,
            desc: this.refs.desc.value,
            note: this.refs.note.value
        });
    },
    handleChange: function () {
        this.props.basicChange(this.refs.name.value, this.refs.desc.value, this.refs.note.value);
    },
    render: function () {
        var textStyle = {
            width: '600px',
            height: '100px'
        };
        return (
            <div>
                <section>
                    <labe>Story Name:</labe>
                    <input ref="name" onChange={this.handleChange} value={this.props.basic.name}/>
                    <button onClick={this.click}>{this.props.id ? 'Edit Story' : 'Create Story'}</button>

                    <h3>Description:</h3>
                    <textarea row="10" ref="desc" onChange={this.handleChange}
                              value={this.props.basic.desc} style={textStyle}></textarea>
                    <h3>Notes:</h3>
                    <textarea row="10" ref="note" onChange={this.handleChange}
                              value={this.props.basic.note} style={textStyle}></textarea>
                </section>
            </div>
        )
    }
});

/**
 * story include the base description, status, schedule and attachments
 */
var Story = React.createClass({
    getInitialState: function () {
        var search = window.location.search;
        if (search) {
            var result = search.match(/id=([\w]*)/);
            if (result.length > 1) {
                this.storyId = result[1];
            }
        }
        return {
            story: {
                basic: {
                    name: '',
                    desc: '',
                    note: ''
                },
                status: {
                    planEst: 0,
                    taskEst: 0,
                    todo: 0
                },
                schedule: {
                    project: '',
                    iteration: '',
                    release: ''
                }
            }
        }
    },
    statusChange: function (plan, task, todo) {
        this.state.story.status = {
            planEst: parseInt(plan),
            taskEst: parseInt(task),
            todo: parseInt(todo)
        };
        this.setState({
            story: this.state.story
        });
    },
    basicChange: function (name, desc, note) {
        this.state.story.basic = {
            name: name,
            desc: desc,
            note: note
        };
        this.setState({
            story: this.state.story
        });
    },
    scheduleChange: function (project, iteration, release) {
        this.state.story.schedule = {
            project: project,
            iteration: iteration,
            release: release
        };
        this.setState({
            story: this.state.story
        });
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase('https://mimikiyru.firebaseio.com').child('story');
        this.indexRef = new Firebase('https://mimikiyru.firebaseio.com').child('index');
        if (this.storyId) {
            this.firebaseRef.orderByKey().equalTo(this.storyId).once('value', function (snap) {
                if (!snap.val()) {
                    delete  this.storyId;
                } else {
                    this.setState({
                        story: snap.val()[this.storyId]
                    });
                }
            }.bind(this));
        }
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    create: function () {
        var data = this.state.story;
        data.updateTime = new Date().getTime().toString();

        if (!data.basic.name) {
            alert('must need name');
            return;
        }
        if (data.storyId) {
            saveData(this, data)
        } else {
            data.id = new Date().getTime().toString();
            this.indexRef.orderByKey().equalTo('storyIndex').once('value', function (snap) {
                var index = snap.val()['storyIndex'];
                var storyId = 'STORY0' + index;
                //update index
                this.indexRef.child('storyIndex').set(parseInt(index) + 1);
                data.storyId = storyId;
                var temp = this;

                saveData(this, data, function () {
                    temp.setState({
                        story: data
                    });
                    //change url without refresh page
                    window.history.pushState('', 'Edit ' + data.storyId, window.location.href + '?id=' + data.storyId);
                });
            }.bind(this));
        }

        function saveData(me, data, cb) {
            me.firebaseRef.child(data.storyId).set(data, function (error) {
                if (!error) {
                    if (cb) {
                        cb();
                    }
                    console.log('save succ!');
                } else {
                    delete me.storyId;
                    alert('save fail! please to check on console');
                    console.log('error happen when ')
                }
            });
        }

    },
    render: function () {

        return (
            <div>
                <StoryBasic onCreate={this.create} basicChange={this.basicChange}
                            basic={this.state.story.basic} id={this.state.story.id}>
                </StoryBasic>
                <Attachments></Attachments>
                <StorySchedule schedule={this.state.story.schedule}
                               scheduleChange={this.scheduleChange}>
                </StorySchedule>
                <StoryStatus statusChange={this.statusChange} status={this.state.story.status}>
                </StoryStatus>
            </div>
        )
    }
});

var el = document.getElementById('story');
if (el) {
    ReactDOM.render(React.createElement(Story, null), el);
}
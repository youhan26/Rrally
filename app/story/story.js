/**
 * Created by youha on 4/14/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var BS = require('react-bootstrap');
var Tab = BS.Tab;
var Tabs = BS.Tabs;
var ListGroup = BS.ListGroup;
var ListGroupItem = BS.ListGroupItem;

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
            this.props.status.taskEst,
            this.props.status.todo
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
                    {this.props.status.taskEst}&nbsp;&nbsp;
                    <label>TODO (H):</label>
                    {this.props.status.todo}&nbsp;&nbsp;
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
        this.props.basicChange({
            name: this.refs.name.value,
            desc: this.refs.desc.value,
            note: this.refs.note.value
        });
    },
    render: function () {
        var textStyle = {
            width: '600px',
            height: '100px'
        };
        return (
            <div>
                <form>
                    <labe>Story Name:</labe>
                    <input ref="name" onChange={this.handleChange} value={this.props.basic.name}/>
                    <BS.Button onClick={this.click} bsStyle="primary" bsSize="small">
                        {this.props.id ? 'Edit Story' : 'Create Story'}
                    </BS.Button>

                    <h3>Description:</h3>
                    <textarea row="10" ref="desc" onChange={this.handleChange}
                              value={this.props.basic.desc} style={textStyle}></textarea>
                    <h3>Notes:</h3>
                    <textarea row="10" ref="note" onChange={this.handleChange}
                              value={this.props.basic.note} style={textStyle}></textarea>
                </form>
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
                    },
                    task: [],
                    case: []
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
        basicChange: function (basic) {
            this.state.story.basic = basic;
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
            this.firebaseRef = new Firebase('https://fuckme.firebaseio.com').child('story');
            this.indexRef = new Firebase('https://fuckme.firebaseio.com').child('index');
            if (this.storyId) {
                this.firebaseRef.orderByKey().equalTo(this.storyId).once('value', function (snap) {
                    if (!snap.val()) {
                        delete  this.storyId;
                    } else {
                        var story = snap.val()[this.storyId];
                        if (!story.task) {
                            story.task = [];
                        }
                        if (!story.case) {
                            story.case = [];
                        }
                        this.setState({
                            story: story
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
        addTask: function () {
            this.state.story.task.push({
                id: new Date().getTime().toString(),
                name: '',
                est: 0,
                todo: 0
            });
            this.setState({
                story: this.state.story
            });
        },
        taskChange: function (task) {
            var list = this.state.story.task;
            for (var i in list) {
                if (list[i].id === task.id) {
                    list[i] = task;
                    break;
                }
            }
            this.updateStoryStatus();
            this.setState({
                story: this.state.story
            });
        },
        updateStoryStatus: function () {
            var story = this.state.story;
            var task = story.task;
            var est = 0, todo = 0;

            for (var i  in task) {
                est += task[i].est;
                todo += task[i].todo;
            }
            story.status.taskEst = est;
            story.status.todo = todo;
        },
        addCase: function () {
            this.state.story.case.push({
                id: new Date().getTime().toString(),
                name: '',
                est: 0,
                todo: 0
            });
            this.setState({
                story: this.state.story
            });
        },
        caseChange: function (data) {
            var list = this.state.story.case;
            for (var i in list) {
                if (list[i].id === data.id) {
                    list[i] = data;
                    break;
                }
            }
            this.setState({
                story: this.state.story
            });
        },
        render: function () {
            return (
                <div>
                    <Tabs defaultActiveKey={1} animation={false} id="storyDetailTabs">
                        <Tab eventKey={1} title="Story ">
                            <BS.Well>
                                <StoryBasic onCreate={this.create} basicChange={this.basicChange}
                                            basic={this.state.story.basic} id={this.state.story.id}>
                                </StoryBasic>
                            </BS.Well>
                            <Attachments></Attachments>
                            <BS.Well>
                                <StorySchedule schedule={this.state.story.schedule}
                                               scheduleChange={this.scheduleChange}>
                                </StorySchedule>
                            </BS.Well>
                            <BS.Well>
                                <StoryStatus statusChange={this.statusChange} status={this.state.story.status}>
                                </StoryStatus>
                            </BS.Well>
                        </Tab>
                        <Tab eventKey={2} title="Task">
                            <Task saveAll={this.create} task={this.state.story.task} onAdd={this.addTask}
                                  onChange={this.taskChange}></Task>
                        </Tab>
                        <Tab eventKey={3} title="Test Case">
                            <Case saveAll={this.create} case={this.state.story.case} onAdd={this.addCase}
                                  onChange={this.caseChange}>
                            </Case>
                        </Tab>
                    </Tabs>
                </div>
            )
        }
    })
    ;

var Task = React.createClass({
    renderItem: function (item) {
        return <BS.Well key={item.id}><TaskItem task={item} onChange={this.onChange}></TaskItem></BS.Well>
    },
    saveTask: function (task) {
        this.props.saveAll(task);
    },
    onChange: function (task) {
        this.props.onChange(task);
    },
    addTask: function () {
        this.props.onAdd();
    },
    render: function () {
        return (
            <div>
                {this.props.task.map(this.renderItem)}
                <BS.Button onClick={this.addTask}>Add Task</BS.Button>
                <BS.Button onClick={this.saveTask}>Save Task</BS.Button>
            </div>
        )
    }
});

var TaskItem = React.createClass({
    handleChange: function () {
        this.props.onChange({
            id: this.props.task.id,
            name: this.refs.name.value,
            est: parseFloat(this.refs.est.value),
            todo: parseFloat(this.refs.todo.value),
            updateTime: new Date().getTime()
        });
    },
    render: function () {
        var style = {
            width: '400px'
        };
        return (
            <div>
                <label>Task Name:</label>
                <input value={this.props.task.name} onChange={this.handleChange} ref="name" style={style}/>
                &nbsp;&nbsp;
                <label>Task Est:</label>
                <input value={this.props.task.est} onChange={this.handleChange} ref="est" type="number"/>
                &nbsp;&nbsp;
                <label>Task todo:</label>
                <input value={this.props.task.todo} onChange={this.handleChange} ref="todo" type="number"/>
            </div>
        )
    }
});


var Case = React.createClass({
    renderItem: function (item) {
        return (
            <BS.Well key={item.id}>
                <CaseItem case={item} onChange={this.onChange}></CaseItem>
            </BS.Well>
        )
    },
    saveCase: function (data) {
        this.props.saveAll(data);
    },
    onChange: function (data) {
        this.props.onChange(data);
    },
    addCase: function () {
        this.props.onAdd();
    },
    render: function () {
        return (
            <div>
                {this.props.case.map(this.renderItem)}
                <BS.Button onClick={this.addCase}>Add Case</BS.Button>
                <BS.Button onClick={this.saveCase}>Save Case</BS.Button>
            </div>
        )
    }
});

var CaseItem = React.createClass({
    handleChange: function () {
        this.props.onChange({
            id: this.props.case.id,
            name: this.refs.name.value,
            step: this.refs.step.value,
            expc: this.refs.expc.value,
            actual: this.refs.actual.value,
            updateTime: new Date().getTime()
        });
    },
    render: function () {
        var style = {
            width: '250px',
            height: '100px'
        };
        var divStyle = {
            width: '33%',
            display: 'inline'
        };
        return (
            <div>
                <label>Case Name: </label>
                <input value={this.props.case.name} onChange={this.handleChange} ref="name"/>
                <br/>
                <div style={divStyle}>
                    <label>Step: </label>
                    <textarea value={this.props.case.step} onChange={this.handleChange} ref="step" style={style}/>
                </div>

                <div style={divStyle}>
                    <label>Expected Result : </label>
                    <textarea value={this.props.case.expc} onChange={this.handleChange} ref="expc" style={style}/>
                </div>

                <div style={divStyle}>
                    <label>Actual Result : </label>
                        <textarea value={this.props.case.actual} onChange={this.handleChange} ref="actual"
                                  style={style}/>
                </div>
            </div>
        )
    }
});

var el = document.getElementById('story');
if (el) {
    ReactDOM.render(React.createElement(Story, null), el);
}

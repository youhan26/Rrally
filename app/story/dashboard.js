/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');
var bs = require('react-bootstrap');
var Button = bs.Button;
var constant = require('./../common/config');
var LIST = require('./../common/customerList');
var ProjectList = LIST.ProjectList;
var ReleaseSelect = LIST.ReleaseSelect;
var Effort = require('./effort');

var ReactGridLayout = require('react-grid-layout');

// var MyFirstGrid = React.createClass({
//     render: function () {
//         return (
//             <ReactGridLayout className="layout" cols={12} rowHeight={30} width={window.innerWidth}>
//                 <div className="dashboard" key="a" _grid={{x: 0, y: 0, w: 10, h: 20, minW : 10, maxW : 12}}>
//                     <StoryList></StoryList>
//                 </div>
//             </ReactGridLayout>
//         )
//     }
// });


var StoryList = React.createClass({
    getInitialState: function () {
        this.curRelease = '';
        this.curProject = 4;
        return {
            items: [[], [], [], [], [], []],
            effortList: []
        }
    },
    loadData: function () {
        var storyList = [];
        this.firebaseRef.once('value', function (snap) {
            this.state.items = [[], [], [], [], [], []];
            var dataList = snap.val();
            if (dataList) {
                for (var i in dataList) {
                    var data = dataList[i];
                    if (data && data.action && data.schedule.release.toString() == this.curRelease.toString()
                        && data.schedule.project.toString() == this.curProject.toString()) {
                        storyList.push(data);
                        if (!data.bug) {
                            data.bug = [];
                        }
                        this.state.items[data.action - 1].push(data);
                    }
                }
            }
            this.setState({
                effortList: this.calEffort(storyList),
                items: this.state.items
            });
        }.bind(this));
    },
    getMemberById: function (id) {
        if (id) {
            for (var i in this.members) {
                if (id.toString() === this.members[i].id.toString()) {
                    return this.members[i].name;
                }
            }
        }
    },
    calEffort: function (list) {
        var result = {};
        for (var i in list) {
            var story = list[i];
            if (story.task) {
                var tasks = story.task;
                for (var j in tasks) {
                    var owner = tasks[j].owner;
                    if (owner != undefined) {
                        if (result[owner]) {
                            result[owner].est += tasks[j].est;
                            result[owner].todo += tasks[j].todo;
                        } else {
                            result[owner] = {
                                id: owner,
                                est: tasks[j].est,
                                todo: tasks[j].todo
                            }
                        }
                    }
                }
            }
        }
        var list = []
        for (var i in result) {
            list.push({
                id: result[i].id,
                member: this.getMemberById(result[i].id),
                est: result[i].est,
                todo: result[i].todo
            });
        }
        return list;
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase(constant.story);
        this.ref = new Firebase(constant.host);
        this.ref.child('member').once('value', function (snap) {
            this.members = snap.val();
            this.ref.child('index').child('releaseIndex').once('value', function (snap) {
                this.ref.child('release').child(snap.val() - 1).once('value', function (tt) {
                    var value = tt.val();
                    if (value) {
                        this.curRelease = value.id;
                        this.curReleaseName = value.name;
                    }
                    this.loadData();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
        this.indexRef.off();
        this.ref.off();
    },
    renderLi: function (item) {
        return (
            <StoryItem story={item} key={item.id} onLeft={this.onLeft} onRight={this.onRight}>
            </StoryItem>
        );
    },
    onLeft: function (data) {
        if (!data || data.action <= 1) {
            alert('ni shi dou bi me? ');
            return;
        }
        this.firebaseRef.child(data.storyId).child('action').set(data.action - 1, function (error) {
            if (!error) {
                this.loadData();
            }
        }.bind(this));
    },
    onRight: function (data) {
        if (!data || data.action >= 6) {
            alert('ni shi dou bi me? ');
            return;
        }
        this.firebaseRef.child(data.storyId).child('action').set(data.action + 1, function (error) {
            if (!error) {
                this.loadData();
            }
        }.bind(this));
    },
    projectChange: function (value) {
        this.curProject = value;
        this.loadData();
    },
    releaseChange: function (value) {
        this.curRelease = value;
        this.loadData();
    },
    render: function () {
        return (
            <div>
                <div>
                    <div>
                        <h4>
                            <ProjectList value={this.curProject} onChange={this.projectChange}
                                         floatingLabelText="Project"/>
                            <ReleaseSelect value={this.curRelease} onChange={this.releaseChange}
                                           floatingLabelText="Release"/>
                        </h4>
                    </div>
                    <div className="state-div">
                        <h3>定义</h3>
                        {this.state.items[0].map(this.renderLi)}
                    </div>
                    <div className="state-div">
                        <h3>开发中</h3>
                        {this.state.items[1].map(this.renderLi)}
                    </div>
                    <div className="state-div">
                        <h3>开发完成</h3>
                        {this.state.items[2].map(this.renderLi)}
                    </div>
                    <div className="state-div">
                        <h3>测试中</h3>
                        {this.state.items[3].map(this.renderLi)}
                    </div>
                    <div className="state-div">
                        <h3>测试完成</h3>
                        {this.state.items[4].map(this.renderLi)}
                    </div>
                    <div className="state-div">
                        <h3>上线</h3>
                        {this.state.items[5].map(this.renderLi)}
                    </div>
                </div>
                <Effort items={this.state.effortList}></Effort>
            </div>
        )
    }
});

var StoryItem = React.createClass({
    goEditPage: function () {
        var data = this.props.story;
        if (data.storyId) {
            window.open("story.html?id=" + data.storyId, '_blank');
        }
    },
    clickLeft: function () {
        this.props.onLeft(this.props.story);
    },
    clickRight: function () {
        this.props.onRight(this.props.story);
    },
    renderBugItem: function (item) {
        return (
            <div key={item.id}>
                <span className={item.status>1 ? 'fixed-bug' : 'open-bug'}> {item.name} </span>
            </div>
        )
    },
    render: function () {
        var style = {
            float: 'right'
        };
        return (
            <div>
                <section className="storyItem">
                    <h4>
                        <a onClick={this.goEditPage}>
                            {this.props.story.storyId}--{this.props.story.basic.name}
                        </a>
                    </h4>
                    <label>Plan Est:</label> {this.props.story.status.planEst}<br/>
                    <label>Task Est:</label> {this.props.story.status.taskEst}<br/>
                    <label>Todo:</label> {this.props.story.status.todo}<br/>
                    <label>Bugs: {this.props.story.bug.length}</label><br/>
                    <label>测试时间: {this.props.story.status.testDate != (undefined || null) ? new Date(this.props.story.status.testDate).Format('yyyy/MM/dd') : '无'}</label><br/>
                    {this.props.story.bug.map(this.renderBugItem)}
                    <Button bsStyle="primary" onClick={this.clickLeft}>&lt;</Button>
                    <Button bsStyle="primary" style={style} onClick={this.clickRight}>&gt;</Button>
                </section>
            </div>
        )
    }
});

var el = document.getElementById('storyList');

if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}
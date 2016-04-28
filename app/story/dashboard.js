/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');
var bs = require('react-bootstrap');
var Button = bs.Button;
var constant = require('./../common/constant');
var ReleaseSelect = require('./../common/releaseSelect');

var StoryList = React.createClass({
    getInitialState: function () {
        return {
            items: [[], [], [], [], [], []],
            release: ''
        }
    },
    updateList: function (list, data) {
        if (list) {
            for (var i in list) {
                if (list[i].id == data.id) {
                    list.splice(i, 1);
                    break;
                }
            }
        }

    },
    loadData: function () {
        this.firebaseRef.once('value', function (snap) {
            this.state.items = [[], [], [], [], [], []];
            var dataList = snap.val();
            if (dataList) {
                for (var i in dataList) {
                    var data = dataList[i];
                    if (data && data.action && data.schedule.release.toString() == this.state.release.toString()) {
                        data.bug = [];
                        this.state.items[data.action - 1].push(data);
                        var index = this.state.items[data.action - 1].length;
                        //TODO need to change for the render
                        this.bugRef.child(data.storyId).once('value', function (snap) {
                            var bugs = snap.val();
                            if (bugs && this.state.items[data.action - 1][index - 1]) {
                                this.state.items[data.action - 1][index - 1].bug = bugs;
                                this.setState({
                                    items: this.state.items,
                                    release: this.state.release
                                });
                            }
                        }.bind(this));
                    }
                }
            }
            this.setState({
                items: this.state.items
            });
        }.bind(this));
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase(constant.story);
        this.bugRef = new Firebase(constant.host + '/bug');
        this.loadData();
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
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
        this.firebaseRef.child(data.storyId).child('action').set(data.action - 1);
        //TODO
    },
    onRight: function (data) {
        if (!data || data.action >= 6) {
            alert('ni shi dou bi me? ');
            return;
        }
        this.firebaseRef.child(data.storyId).child('action').set(data.action + 1);
        //TODO
        // var before = this.state.items[data.action - 2];
        // var after = this.state.items[data.action];
        // this.updateList(before, data);
        // this.updateList(after, data);
        // this.state.items[data.action - 1].sort(function (a, b) {
        //     if (a.id > b.id) {
        //         return 1;
        //     }
        //     return -1;
        // });
    },
    releaseChange: function (value) {
        this.setState({
            items: this.state.items,
            release: value
        });
        this.loadData();
    },
    render: function () {
        return (
            <div>
                <div>
                    <label>Select Release: </label>
                    <ReleaseSelect value={this.state.release} onChange={this.releaseChange}>
                    </ReleaseSelect>
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
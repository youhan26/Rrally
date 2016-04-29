/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');
var bs = require('react-bootstrap');
var constant = require('./../common/config');
var Button = bs.Button;
var Well = bs.Well;

var StoryList = React.createClass({
    getInitialState: function () {
        return {
            items: []
        }
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase(constant.story);
        this.loadData();
    },
    loadData: function () {
        this.firebaseRef.once('value', function (snap) {
            var data = snap.val();
            var items = [];
            for (var i in data) {
                if (data[i].schedule.release == '') {
                    items.push(data[i]);
                }
            }
            items.sort(function (a, b) {
                if (a.index && b.index) {
                    if (a.index < b.index) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else {
                    if (a.id < b.id) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
            this.setState({
                items: items
            });
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    up: function (data) {
        var list = this.state.items;
        var index = list.indexOf(data);
        if (index == 0) {
            alert('can move more');
            return;
        }
        var before = list[index - 1];
        this.firebaseRef.child(data.storyId).update({
            index: before.index
        });
        this.firebaseRef.child(before.storyId).update({
            index: data.index
        });
        this.loadData();
    },
    down: function (data) {
        var list = this.state.items;
        var index = list.indexOf(data);
        if (index == list.length - 1) {
            alert('can move more');
            return;
        }
        var after = list[index + 1];
        this.firebaseRef.child(data.storyId).update({
            index: after.index
        });
        this.firebaseRef.child(after.storyId).update({
            index: data.index
        });
        this.loadData();
    },
    renderLi: function (item) {
        return (
            <StoryItem story={item} key={item.id} up={this.up} down={this.down}>
            </StoryItem>
        );
    },
    render: function () {
        return (
            <div>
                {this.state.items.map(this.renderLi)}
            </div>
        )
    }
});

var StoryItem = React.createClass({
    goEditPage: function () {
        var data = this.props.story;
        if (data.storyId) {
            window.open('http://' + location.host + "/app/story/story.html?id=" + data.storyId, '_blank');
        }
    },
    up: function () {
        this.props.up(this.props.story);
    },
    down: function () {
        this.props.down(this.props.story);
    },
    render: function () {
        return (
            <div>
                <Well className="storyItem">
                    <Button bsStyle="default" onClick={this.goEditPage}>
                        {this.props.story.storyId}
                    </Button> &nbsp;&nbsp;
                    {this.props.story.basic.name}
                    <div className="right">
                        <Button onClick={this.up}>&#8679;</Button>
                        <Button onClick={this.down}>&#8681;</Button>
                    </div>
                </Well>
            </div>
        )
    }
});

var el = document.getElementById('backlog');

if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}
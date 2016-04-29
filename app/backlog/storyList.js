/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');
var bs = require('react-bootstrap');
var config = require('./../common/config');
var constant = require('./../common/constant');
var Button = bs.Button;
var Well = bs.Well;
var ReleaseSelect = require('./../common/releaseSelect');

var StoryList = React.createClass({
    getInitialState: function () {
        return {
            items: [],
            release: ''
        }
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase(config.story);
        this.releaseRef = new Firebase(config.release);
        this.releaseRef.once('value', function (snap) {
            var list = snap.val();
            if (list && list.length > 0) {
                this.releaseList = list;
                this.loadData();
            }
        }.bind(this));
    },
    getReleaseName: function (id) {
        if (id) {
            var list = this.releaseList;
            for (var i in list) {
                if (list[i].id.toString() === id.toString()) {
                    return list[i].name;
                }
            }
        }
        return '';
    },
    loadData: function (withFilter) {
        this.firebaseRef.once('value', function (snap) {
            var data = snap.val();
            var items = [];
            for (var i in data) {
                if (data[i].schedule.release) {
                    data[i].schedule.releaseName = this.getReleaseName(data[i].schedule.release);
                }
                if (data[i].action) {
                    data[i].actionName = constant.storyStatus[data[i].action - 1].name;
                }
                if (withFilter) {
                    if (data[i].schedule.release.toString() === this.state.release.toString()) {
                        items.push(data[i]);
                    }
                } else {
                    items.push(data[i]);
                }
            }
            items.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1;
                } else {
                    return 1;
                }
            });
            this.setState({
                items: items,
                release: this.state.release
            });
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    renderLi: function (item) {
        return (
            <StoryItem story={item} key={item.id} getReleaseName={this.getReleaseName}>
            </StoryItem>
        );
    },
    releaseChange: function (value) {
        this.setState({
            release: value,
            items: this.state.items
        });
    },
    filter: function () {
        this.loadData(true);
    },
    render: function () {
        return (
            <div>
                <label>Release :</label>
                <ReleaseSelect value={this.state.release} onChange={this.releaseChange}></ReleaseSelect>

                <Button onClick={this.filter}>Filter: </Button>
                <Button onClick={this.loadData}>Reset: </Button>
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
    render: function () {
        return (
            <div>
                <Well className="storyItem">
                    <Button bsStyle="default" onClick={this.goEditPage}>
                        {this.props.story.storyId}
                    </Button> &nbsp;&nbsp;
                    {this.props.story.schedule.releaseName}
                    &nbsp;&nbsp;
                    {this.props.story.actionName}
                    &nbsp;&nbsp;
                    <div className="right">
                        {this.props.story.basic.name}
                    </div>
                </Well>
            </div>
        )
    }
});

var el = document.getElementById('storyList');

if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}
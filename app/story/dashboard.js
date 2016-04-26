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

var StoryList = React.createClass({
    getInitialState: function () {
        return {
            items: [[], [], [], [], [], []]
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
    componentWillMount: function () {
        this.firebaseRef = new Firebase(constant.story);
        this.firebaseRef.orderByChild('id').on("child_added", function (snap) {
            var data = snap.val();
            if (data && data.action) {
                this.state.items[data.action - 1].push(data)
            }
            this.setState({
                items: this.state.items
            });
        }.bind(this));
        this.firebaseRef.on('child_changed', function (snap) {
            var data = snap.val();
            if (data.id) {
                var flag = true;
                var list = this.state.items[data.action - 1];
                for (var i in list) {
                    if (list[i].id === data.id) {
                        list[i] = data;
                        flag = false;
                        break;
                    }
                }
                var before = this.state.items[data.action - 2];
                var after = this.state.items[data.action];
                this.updateList(before, data);
                this.updateList(after, data);

                if (flag) {
                    this.state.items[data.action - 1].push(data);
                    this.state.items[data.action - 1].sort(function (a, b) {
                        if (a.id > b.id) {
                            return 1;
                        }
                        return -1;
                    });
                }
                this.setState({
                    items: this.state.items
                });
            }
        }.bind(this));
        this.firebaseRef.on('child_removed', function (snap) {
            var data = snap.val();
            if (data.id) {
                var list = this.state.items[data.action - 1];
                for (var i in list) {
                    if (list[i].id === data.id) {
                        list.splice(i, 1);
                        break;
                    }
                }
                this.setState({
                    items: this.state.items
                });
            }
        }.bind(this));
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
    },
    onRight: function (data) {
        if (!data || data.action >= 6) {
            alert('ni shi dou bi me? ');
            return;
        }


        
        this.firebaseRef.child(data.storyId).child('action').set(data.action + 1);
    },
    render: function () {
        return (
            <div>
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
    render: function () {
        return (
            <div>
                <section className="storyItem">
                    <h4>
                        <a onClick={this.goEditPage}>
                            {this.props.story.storyId}--{this.props.story.basic.name}
                        </a>
                    </h4>
                    <Button bsStyle="primary" onClick={this.clickLeft}>&lt;</Button>
                    <Button bsStyle="primary" class="right-button" onClick={this.clickRight}>&gt;</Button>
                </section>
            </div>
        )
    }
});

var TextLine = React.createClass({
    render: function () {
        var lines = this.props.lines;
        var lineMap = lines.split('\n');

        function wrap(item) {
            var data = Math.random() * 10000;
            return <p key={data}>{item}</p>;
        }

        return (
            <div>
                {lineMap.map(wrap)}
            </div>
        );
    }
});


var el = document.getElementById('storyList');

if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}
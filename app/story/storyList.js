/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');

var StoryList = React.createClass({
    getInitialState: function () {
        return {
            items: []
        }
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase('https://mimikiyru.firebaseio.com/story');
        this.firebaseRef.on("child_added", function (snap) {
            this.state.items.push(snap.val());
            this.setState({
                items: this.state.items
            });
        }.bind(this));
        this.firebaseRef.on('child_changed', function (snap) {
            var data = snap.val();
            if (data.id) {
                var list = this.state.items;
                for (var i in list) {
                    if (list[i].id === data.id) {
                        list[i] = data;
                        break;
                    }
                }
                this.setState({
                    items: this.state.items
                });
            }
        }.bind(this));
        this.firebaseRef.on('child_removed', function (snap) {
            var data = snap.val();
            if (data.id) {
                var list = this.state.items;
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
    onEdit: function () {
        console.log('on Edit', arguments);
    },
    renderLi: function (item) {
        return (
            <StoryItem onEdit={this.onEdit} story={item} key={item.id}></StoryItem>
        );
    },
    render: function () {
        return (
            <div>
                <ul>{this.state.items.map(this.renderLi)}</ul>
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
    render: function () {
        return (
            <div>
                <li>
                    <section>
                        <h3>{this.props.story.basic.name}</h3>
                        <h4>Desc:</h4>
                        {this.props.story.basic.desc}
                        <h4>Note :</h4>
                        {this.props.story.basic.note}
                        <br/>

                        <label>Plan Est:</label>{this.props.story.status.planEst}&nbsp;
                        <label>Task Est:</label>{this.props.story.status.taskEst}&nbsp;
                        <label>TODO:</label>{this.props.story.status.todo}&nbsp;
                        <button onClick={this.goEditPage}>编辑</button>
                    </section>
                </li>
            </div>
        )
    }
});


var el = document.getElementById('storyList');

if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}

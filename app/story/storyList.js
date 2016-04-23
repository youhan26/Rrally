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
    render: function () {
        function renderLi(item) {
            return (
                <li key={item.id}>
                    <section>
                        <h3>{item.basic.name}</h3>
                        <h4>Desc:</h4>
                        {item.basic.desc}
                        <h4>Note :</h4>
                        {item.basic.note}

                        <label>Plan Est:</label>{item.status.planEst}
                        <label>Task Est:</label>{item.status.taskEst}
                        <label>TODO:</label>{item.status.todo}
                    </section>
                </li>
            );
        }

        return (
            <div>
                <ul>{this.state.items.map(renderLi)}</ul>
            </div>
        )
    }
});


var el = document.getElementById('storyList');

if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}

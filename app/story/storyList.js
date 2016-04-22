/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');

var List = React.createClass({
    displayName: 'list',
    render: function () {
        function renderLi(item) {
            return (
                <li key={item.key}>
                    {item.name}
                </li>
            );
        }

        return (
            <div>
                <ul>{this.props.data.map(renderLi)}</ul>
            </div>
        )
    }
});

var StoryList = React.createClass({
    getInitialState: function () {
        return {
            items: []
        }
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase('https://mimikiyru.firebaseio.com/story');
        this.firebaseRef.on("child_added", function (data) {
            this.state.items.push(data.val());
            this.setState({
                items: this.state.items
            });
        }.bind(this));
        //TODO 'child_changed', 'child_removed', 'child_moved'
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    // submit: function (e) {
    //     e.preventDefault();
    //     var date = new Date();
    //     this.firebaseRef.push({
    //         name: this.state.text,
    //         key: new Date().getTime().toString()
    //     });
    //     this.state.text = '';
    //     this.setState({
    //         text: this.state.text
    //     });
    // },
    // textChange: function (e) {
    //     this.setState({
    //         text: e.target.value
    //     });
    // },
    render: function () {
        return (
            <div>
                <List data={this.state.items}></List>
            </div>
        )
    }
});


var el = document.getElementById('storyList');
if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}
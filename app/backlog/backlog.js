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
            return <li key={item.key}>{item.name}</li>;
        }

        return (
            <div>
                <ul>{this.props.data.map(renderLi)}</ul>
            </div>
        )
    }
});

var TodoList = React.createClass({
    displayName: 'todoList',
    getInitialState: function () {
        return {
            items: [],
            text: ''
        }
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase('https://mimikiyru.firebaseio.com/todoList');
        this.firebaseRef.on("child_added", function (data) {
            this.state.items.push(data.val());
            this.setState({
                items: this.state.items
            });
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    submit: function (e) {
        e.preventDefault();
        var date = new Date();
        this.firebaseRef.push({
            name: this.state.text,
            key: new Date().getTime().toString()
        });
        this.state.text = '';
        this.setState({
            text: this.state.text
        });
    },
    textChange: function (e) {
        this.setState({
            text: e.target.value
        });
    },
    render: function () {
        return (
            <div>
                <List data={this.state.items}></List>
                <form onSubmit={this.submit}>
                    <input value={this.state.text} onChange={this.textChange}/>
                    <button>{'Add #' + (this.state.items.length + 1)}</button>
                </form>
            </div>
        )
    }
});


var el = document.getElementById('backlog');

ReactDOM.render(React.createElement(TodoList, null), el);



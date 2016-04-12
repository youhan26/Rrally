/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');


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
    submit: function (e) {
        e.preventDefault();
        this.state.items.push({
            name: this.state.text,
            key: new Date()
        });
        this.state.text = '';
        this.setState({
            text: this.state.text,
            items: this.state.items
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


var el = document.getElementById('todoList');

ReactDOM.render(React.createElement(TodoList, null), el);



/**
 * Created by YouHan on 2016/4/16.
 */

'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');


var AddChild = React.createClass({
    getInitialState: function () {
        return {
            name: ''
        }
    },
    componentWillMount: function () {
        this.firebaseRef = new firebase('https://fuckme.firebaseio.com');
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    addChild: function () {
        if (this.state.name) {
            this.child = this.firebaseRef.child(this.state.name);
            this.child.push({
                name: 'test'
            });
            this.setState({
                name: ''
            });
        }
    },
    nameChange: function (e) {
        this.setState({
            name: e.target.value
        });
    },
    render: function () {
        return (
            <div>
                <h2>Add firebase child:</h2>
                <input value={this.state.name} onChange={this.nameChange}/>
                <button type="button" onClick={this.addChild}>Add Child</button>
            </div>
        )
    }
});


var el = document.getElementById('addChild');

ReactDOM.render(React.createElement(AddChild, null), el);



var React = require('react');
var ReactDOM = require('react-dom');
var ReactBootstrap = require('react-bootstrap');


var CommentBox = React.createClass({
    displayName: 'CommentBox',
    render: function () {
        return (
            React.createElement('div', {
                    className: 'commentBox'
                },
                "Hello, world! I am a CommentBox."
            )
        );
    }
});
ReactDOM.render(
    React.createElement(CommentBox, null),
    document.getElementById('example')
);
var React = require('react');
var ReactDOM = require('react-dom');
var ReactBootstrap = require('react-bootstrap');
var marked = require('marked');

var CommentList = React.createClass({
    render: function () {
        return (
            <div className="commentList">
                Hello, world! I am a CommentList.
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function () {
        return (
            <div className="commentForm">
                Hello, world! I am a CommentForm.
                {this.props.author}
            </div>
        );
    }
});

var Comment = React.createClass({
    rawMarkup: function () {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return {__html: rawMarkup};
    },
    render: function () {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()}/>
            </div>
        );
    }
});

var CommentBox = React.createClass({
    displayName: 'CommentBox',
    render: function () {
        return (
            <div className="commentBox">
                <Comment author="Pete Hunt">This is one comment</Comment>
                <Comment author="Jordan Walke">This is *another* comment</Comment>
                <CommentList />
                <CommentForm />
            </div>
        );
    }
});
ReactDOM.render(React.createElement(CommentBox, null), document.getElementById('example'));
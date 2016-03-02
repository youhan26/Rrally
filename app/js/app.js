/**
 * Created by YouHan on 2016/2/28.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var ReactBootstrap = require('react-bootstrap');

//ReactDOM.render(<h1>Hello, world!</h1>,);


//var button = ReactBootstrap.Button({
//    bsStyle: "success",
//    bsSize: "large",
//    children: "Register"
//});


var CommentBox = React.createClass({
    render: function () {
        return (
            <div className="commentBox">
                Hello, world! I am a CommentBox.
            </div>
        );
    }
});

ReactDOM.render(
    //<h1>Hello, world!</h1>,
    <CommentBox />,
    document.getElementById('example')
);
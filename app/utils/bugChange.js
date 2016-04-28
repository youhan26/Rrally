/**
 * Created by YouHan on 2016/4/25.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var bs = require('react-bootstrap');
var BUTTON = bs.Button;
var constant = require('./../common/constant');

var BugChange = React.createClass({
    componentWillMount: function () {
        this.ref = new firebase(constant.bug);
        this.firebaseRef = new firebase(constant.story);
    },
    componentWillUnmount: function () {
        this.ref.off();
        this.firebaseRef.off();
    },
    change: function () {
        this.firebaseRef.once('value', function (snap) {
            var list = snap.val();
            for (var i  in list) {
                var story = list[i];
                (function (s, me) {
                    me.ref.child(s.storyId).once('value', function (tt) {
                        var bug = tt.val();
                        if (!story.bug && !bug) {
                            // this.firebaseRef.child(story.storyId).child('bug').set([]);
                            console.log('set [] once');
                        } else if (bug) {
                            debugger;
                            me.firebaseRef.child(s.storyId).child('bug').set(bug);
                            console.log('set bug once');
                        } else {
                            console.log('do nothing once');
                        }
                    }.bind(me));
                })(story, this);
            }
        }.bind(this));
    },
    render: function () {
        return (
            <div>
                <h2>change bug module</h2>
                <BUTTON onClick={this.change}>Change</BUTTON>
            </div>
        )
    }
});


var el = document.getElementById('bugChange');

ReactDOM.render(React.createElement(BugChange, null), el);

/**
 * Created by YouHan on 2016/4/25.
 */
var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var bs = require('react-bootstrap');
var BUTTON = bs.Button;

var Release = React.createClass({
    getInitialState: function () {
        return {
            name: ''
        };
    },
    componentWillMount: function () {
        this.firebaseRef = new firebase('https://mimikiyru.firebaseio.com').child('release');
        this.indexRef = new firebase('https://mimikiyru.firebaseio.com').child('index');
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    add: function () {
        var me = this;
        me.indexRef.orderByKey().equalTo('releaseIndex').once('value', function (snap) {
            var index = snap.val()['releaseIndex'];
            //update index

            var data = {
                name: 'Release ' + index,
                id: new Date().getTime()
            };

            me.firebaseRef.child(data.id).set(data, function (error) {
                if (!error) {
                    me.indexRef.child('releaseIndex').set(parseInt(index) + 1);
                    alert('succ!');
                }
            });
        });
    },
    render: function () {
        return (
            <div>
                <h2>New Release</h2>
                <BUTTON onClick={this.add}>New Release</BUTTON>
            </div>
        )
    }
});


var el = document.getElementById('release');

ReactDOM.render(React.createElement(Release, null), el);

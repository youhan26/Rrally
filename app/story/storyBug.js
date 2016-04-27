/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var Firebase = require('firebase');
    var BS = require('react-bootstrap');
    var BugSelect = require('./../common/bugSelect');
    var constant = require('./../common/constant');

    var Bug = React.createClass({
        getInitialState: function () {
            var search = window.location.search;
            if (search) {
                var result = search.match(/id=([\w]*)/);
                if (result.length > 1) {
                    this.storyId = result[1];
                }
            }
            return {
                items: []
            }
        },
        componentWillMount: function () {
            this.firebaseRef = new Firebase(constant.host + '/bug');
            if (this.storyId) {
                this.firebaseRef.orderByKey().equalTo(this.storyId).once('value', function (snap) {
                    var data = snap.val();
                    this.setState({
                        items: data[this.storyId]
                    });
                }.bind(this));
            }
        },
        componentWillUnmount: function () {
            this.firebaseRef.off();
        },
        renderItem: function (item) {
            return (
                <BS.Well key={item.id}>
                    <BugItem bug={item} onChange={this.onChange}></BugItem>
                </BS.Well>
            )
        },
        saveBug: function () {
            if (this.storyId) {
                this.firebaseRef.child(this.storyId).set(this.state.items, function (error) {
                    if (!error) {
                        alert('succ!');
                    }
                });
                return;
            }
            alert('add a story first!');
        },
        onChange: function (data) {
            var list = this.state.items;
            for (var i in list) {
                if (list[i].id == data.id) {
                    list[i] = data;
                    break;
                }
            }
            this.setState({
                items: list
            });
        },
        addBug: function () {
            this.state.items.push({
                id: new Date().getTime().toString(),
                name: '',
                step: '',
                status: 1
            });
            this.setState({
                items: this.state.items
            });
        },
        render: function () {
            return (
                <div>
                    {this.state.items.map(this.renderItem)}
                    <BS.Button onClick={this.addBug}>Add Bug</BS.Button>
                    <BS.Button onClick={this.saveBug}>Save Bug</BS.Button>
                </div>
            )
        }
    });

    var BugItem = React.createClass({
        statusChange: function (value) {
            this.props.onChange({
                id: this.props.bug.id,
                name: this.refs.name.value,
                step: this.refs.step.value,
                status: value,
                updateTime: new Date().getTime()
            });
        },
        handleChange: function () {
            this.props.onChange({
                id: this.props.bug.id,
                name: this.refs.name.value,
                step: this.refs.step.value,
                status: this.props.bug.status,
                updateTime: new Date().getTime()
            });
        },
        render: function () {
            var style = {
                width: '250px',
                height: '100px'
            };
            var divStyle = {
                width: '33%',
                display: 'inline'
            };
            return (
                <div>
                    <label>Bug Name: </label>
                    <input value={this.props.bug.name} onChange={this.handleChange} ref="name"/>
                    <br/>
                    <div style={divStyle}>
                        <label>Step:</label>
                        <textarea value={this.props.bug.step} onChange={this.handleChange} ref="step" style={style}/>
                    </div>
                    <label>Bug Status:</label>
                    <BugSelect value={this.props.bug.status} onChange={this.statusChange}>
                    </BugSelect>
                </div>
            )
        }
    });
    module.exports = Bug;
})();
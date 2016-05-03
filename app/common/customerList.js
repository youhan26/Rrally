/**
 * Created by YouHan on 2016/4/25.
 */

(function () {

    var React = require('react');
    var Firebase = require('firebase');
    var constant = require('./config');

    var BasicList = React.createClass({
        onChange: function () {
            if (this.props.onChange) {
                this.props.onChange(this.refs.release.value);
            }
        },
        getInitialState: function () {
            return {
                items: []
            }
        },

        componentWillMount: function () {
            var dataList = this.props.dataList;
            this.firebaseRef = new Firebase(constant.host + '/' + dataList);
            this.firebaseRef.once('value', function (snap) {
                var value = snap.val();
                if (value) {
                    var items = [];
                    for (var i in value) {
                        items.push(value[i]);
                    }
                    this.setState({
                        items: items
                    });
                }
            }.bind(this));
        },
        componentWillUnmount: function () {
            this.firebaseRef.off();
        },
        render: function () {
            function renderItem(item) {
                return <option key={item.id} value={item.id}>{item.name}</option>;
            }

            return (
                <select value={this.props.value} onChange={this.onChange} ref="release">
                    {this.state.items.map(renderItem)}
                </select>
            )
        }
    });
    var ProjectList = React.createClass({
        onChange: function (data) {
            this.props.onChange(data);
        },
        render: function () {
            return (
                <BasicList dataList="project" value={this.props.value} onChange={this.onChange}></BasicList>
            )
        }
    });

    var ReleaseSelect = React.createClass({
        onChange: function (data) {
            this.props.onChange(data);
        },
        render: function () {
            return (
                <BasicList dataList="release" value={this.props.value} onChange={this.onChange}></BasicList>
            )
        }
    });

    var MemberList = React.createClass({
        onChange: function (data) {
            this.props.onChange(data);
        },
        render: function () {
            return (
                <BasicList dataList="member" value={this.props.value} onChange={this.onChange}></BasicList>
            )
        }
    });

    module.exports = {
        ProjectList: ProjectList,
        ReleaseSelect: ReleaseSelect,
        MemberList: MemberList
    };
})();
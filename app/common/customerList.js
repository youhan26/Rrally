/**
 * Created by YouHan on 2016/4/25.
 */

(function () {

    var React = require('react');
    var Firebase = require('firebase');
    var constant = require('./config');
    var injectTapEventPlugin = require("react-tap-event-plugin");
    var MD = require('material-ui');
    var SelectField = MD.SelectField;
    var MenuItem = MD.MenuItem;

    injectTapEventPlugin();

    var BasicList = React.createClass({
        onChange: function (e, index, value) {
            if (this.props.onChange) {
                this.props.onChange(value);
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
                return <MenuItem key={item.id} value={item.id} primaryText={item.name}/>;
            }

            return (
                <SelectField value={this.props.value} onChange={this.onChange}
                             floatingLabelText={this.props.floatingLabelText}>
                    {this.state.items.map(renderItem)}
                </SelectField>
            )
        }
    });

    var ProjectList = React.createClass({
        onChange: function (data) {
            this.props.onChange(data);
        },
        render: function () {
            this.props.value = parseInt(this.props.value);
            return (
                <BasicList dataList="project" value={parseInt(this.props.value)} onChange={this.onChange}
                           floatingLabelText={this.props.floatingLabelText}></BasicList>
            )
        }
    });

    var ReleaseSelect = React.createClass({
        onChange: function (data) {
            this.props.onChange(data);
        },
        render: function () {
            return (
                <BasicList dataList="release" value={parseInt(this.props.value)} onChange={this.onChange}
                           floatingLabelText={this.props.floatingLabelText}></BasicList>
            )
        }
    });

    var MemberList = React.createClass({
        onChange: function (data) {
            this.props.onChange(data);
        },
        render: function () {
            this.props.value = parseInt(this.props.value);
            return (
                <BasicList dataList="member" value={parseInt(this.props.value)} onChange={this.onChange}
                           floatingLabelText={this.props.floatingLabelText}></BasicList>
            )
        }
    });

    var BugList = React.createClass({
        onChange: function (data) {
            this.props.onChange(data);
        },
        render: function () {
            this.props.value = parseInt(this.props.value);
            return (
                <BasicList dataList="bug" value={parseInt(this.props.value)} onChange={this.onChange}
                           floatingLabelText={this.props.floatingLabelText}></BasicList>
            )
        }
    });

    module.exports = {
        ProjectList: ProjectList,
        ReleaseSelect: ReleaseSelect,
        MemberList: MemberList,
        BasicList: BasicList,
        BugList: BugList
    };
})();
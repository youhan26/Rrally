/**
 * Created by YouHan on 2016/6/14.
 */
(function () {
    var React = require('react');
    var api = require('./../common/api');

    var MD = require('material-ui');
    var RaisedButton = MD.RaisedButton;
    var Card = MD.Card;
    var CardText = MD.CardText;
    var CardHeader = MD.CardHeader;
    var TextField = MD.TextField;

    var MemberToggle = React.createClass({
        save: function () {
            var data = this.props.item;
            if (data.id) {
                api.member.update(data.id, data).then(function (res) {
                    console.log('save success');
                });
            }
        },
        del: function () {
            var me = this;
            var data = this.props.item;
            if (data.id) {
                api.member.del(data.id).then(function () {
                    console.log('save success');
                    me.forceUpdate();
                })
            }
        },
        changeName: function (e) {
            var value = e.target.value;
            this.props.item.name = value;
            this.forceUpdate();
        },
        render: function () {
            return (
                <Card className="manage-project-list-card">
                    <CardText>
                        <TextField
                            value={this.props.item.name}
                            onChange={this.changeName}
                        />
                        <RaisedButton label="Save" primary={true} onClick={this.save}></RaisedButton>
                        <RaisedButton label="Delete" primary={true} onClick={this.del}></RaisedButton>
                    </CardText>
                </Card>
            )
        }
    });

    var MemberManage = React.createClass({
        getInitialState: function () {
            return {
                list: [],
                name: ''
            }
        },
        componentWillMount: function () {
            this.loadData();
        },
        loadData: function () {
            var me = this;
            api.member.get().then(function (data) {
                me.setState({
                    list: data.val(),
                    name: ''
                });
            })
        },
        renderLi: function (item) {
            if (item.id > 0) {
                return (
                    <div key={item.id}>
                        <MemberToggle item={item} del={this.delItem}></MemberToggle>
                    </div>
                )
            }
            return null;
        },
        add: function () {
            var me = this;
            api.member.save({
                name: this.state.name
            }).then(function () {
                me.loadData();
            });
        },
        changeName: function (e) {
            this.setState({
                list: this.state.list,
                name: e.target.value
            });
        },
        render: function () {
            return (
                <div>
                    <Card className="memberCard">
                        <CardHeader
                            title="Member"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            <Card className="manage-project-list-card">
                                <CardText>
                                    <TextField
                                        value={this.state.name}
                                        onChange={this.changeName}
                                    />
                                    <RaisedButton label="Add" primary={true} onClick={this.add}></RaisedButton>
                                </CardText>
                            </Card>
                            {this.state.list.map(this.renderLi)}
                        </CardText>
                    </Card>
                </div>
            )
        }
    });
    module.exports = MemberManage;
})();
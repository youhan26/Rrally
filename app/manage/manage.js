/**
 * Created by YouHan on 2016/5/19.
 */

(function () {
    'use strict';
    var React = require('react');
    var ReactDOM = require('react-dom');
    var api = require('./../common/api');
    var injectTapEventPlugin = require("react-tap-event-plugin");

    var MD = require('material-ui');
    var List = MD.List;
    var ListItem = MD.ListItem;
    var RaisedButton = MD.RaisedButton;
    var Card = MD.Card;
    var CardText = MD.CardText;
    var CardHeader = MD.CardHeader;
    var CardActions = MD.CardActions;
    var Divider = MD.Divider;

    injectTapEventPlugin();

    var manage = React.createClass({
        getInitialState: function () {
            return {}
        },
        render: function () {
            return (
                <div>
                    <ProjectManage></ProjectManage>
                    <MemberManage></MemberManage>
                </div>
            )
        }
    });

    var MemberManage = React.createClass({
        getInitialState: function () {
            return {
                list: []
            }
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
                        </CardText>
                        <CardActions expandable={true}>
                        </CardActions>
                    </Card>
                </div>
            )
        }
    });

    var Toggle = React.createClass({
        click: function () {
            var me = this;
            api.project.updateRelease(this.props.item).then(function () {
                me.props.update();
            });
        },
        render: function () {
            return (
                <Card className="manage-project-list-card">
                    <CardText>
                        <b>{this.props.item.name}</b><br/>
                        <span>Current Release : {this.props.item.releaseName}</span>
                        <RaisedButton label="Next Release" primary={true} onClick={this.click}></RaisedButton>
                    </CardText>
                </Card>
            )
        }
    });

    var ProjectManage = React.createClass({
        getInitialState: function () {
            return {
                list: []
            }
        },
        componentWillMount: function () {
            this.reload();
        },
        reload: function () {
            var me = this
            api.project.get().then(function (data) {
                me.setState({
                    list: data.val()
                })
            })
        },
        renderLi: function (item) {
            if (item.id !== 999) {
                return (
                    <Toggle item={item} key={item.id} update={this.reload}></Toggle>
                );
            }
        },
        render: function () {
            return (
                <div>
                    <Card className="projectCard">
                        <CardHeader
                            title="Project"
                            actAsExpander={true}
                            showExpandableButton={true}
                        />
                        <CardText expandable={true}>
                            {this.state.list.map(this.renderLi)}
                        </CardText>
                        <CardActions expandable={true}>
                        </CardActions>
                    </Card>
                </div>
            )
        }
    });

    var el = document.getElementById('manage');
    if (el) {
        ReactDOM.render(React.createElement(manage, null), el);
    }
})();
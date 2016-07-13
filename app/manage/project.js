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
    var CardActions = MD.CardActions;
    var TextField = MD.TextField;

    var ProjectToggle = React.createClass({
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
                list: [],
                project: ''
            }
        },
        componentWillMount: function () {
            this.reload();
        },
        reload: function () {
            var me = this
            api.project.get().then(function (data) {
                me.setState({
                    list: data.val(),
                    project: ''
                });
            });
        },
        renderLi: function (item) {
            if (item.id !== 999) {
                return (
                    <ProjectToggle item={item} key={item.id} update={this.reload}></ProjectToggle>
                );
            }
        },
        changeProject: function (e) {
            this.setState({
                list: this.state.list,
                project: e.target.value
            });
        },
        add: function () {
            var me = this;
            api.project.save({
                name: this.state.project
            }).then(function () {
                me.reload();
            });
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
                            <Card className="manage-project-list-card">
                                <CardText>
                                    <TextField
                                        value={this.state.project}
                                        onChange={this.changeProject}
                                    />
                                    <RaisedButton label="Add" primary={true} onClick={this.add}></RaisedButton>
                                </CardText>
                            </Card>
                            {this.state.list.map(this.renderLi)}
                        </CardText>
                        <CardActions expandable={true}>
                        </CardActions>
                    </Card>
                </div>
            )
        }
    });
    module.exports = ProjectManage;
})();
/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var LIST = require('./../common/customerList');
    var ReleaseSelect = LIST.ReleaseSelect;
    var MemberList = LIST.MemberList;
    var ProjectList = LIST.ProjectList;
    var MD = require('material-ui');
    var TextField = MD.TextField;
    var Card = MD.Card;
    var CardText = MD.CardText;
    var FlatButton = MD.FlatButton;

    /**
     * story schedule include release version, iteration and so on
     */
    var StorySchedule = React.createClass({
        iterationChange: function (e) {
            this.props.scheduleChange(
                ref.project.value,
                e.target.value,
                this.props.schedule.release
            );
        },
        projectChange: function (value) {
            var ref = this.refs;
            this.props.scheduleChange(
                value,
                ref.iteration.value,
                this.props.schedule.release
            );
        },
        releaseChange: function (value) {
            var ref = this.refs;
            this.props.scheduleChange(
                this.props.schedule.project,
                ref.iteration.value,
                value
            );
        },
        render: function () {
            return (
                <div>
                    <Card>
                        <CardText>
                            <h3>Story Schedule</h3>
                            <label>Project Name: </label>
                            <ProjectList onChange={this.projectChange}
                                         value={this.props.schedule.project}></ProjectList>
                            <TextField value={this.props.schedule.iteration}
                                       floatingLabelText="Iteration"
                                       onChange={this.iterationChange}/>
                            <label>Release : </label>
                            <ReleaseSelect value={this.props.schedule.release} onChange={this.releaseChange}>
                            </ReleaseSelect>
                        </CardText>
                    </Card>
                </div>
            )
        }
    });

    /**
     * story status include schedule status, plan est, task est, to do, owner and project
     * need the story and schedule data from parent
     */

    var StoryStatus = React.createClass({
        getInitialState: function () {
            return {
                planEst: 0,
                taskEst: 0,
                todo: 0
            }
        },
        handleChange: function (e) {
            this.props.statusChange(
                e.target.value,
                this.props.status.taskEst,
                this.props.status.todo
            );
        },
        render: function () {
            /**
             * <label>SCHEDULE STATE:</label>{this.props.schedule.state}<br/>
             * <label>STATUS :</label>{this.props.story.state}<br/>
             */
            return (
                <div>
                    <Card expandable={true}>
                        <CardText>
                            <h3>Story Status</h3>
                            <TextField value={this.props.status.planEst}
                                       type="number" min="0"
                                       floatingLabelText="PLAN EST(H)"
                                       onChange={this.handleChange}/>
                            <label>TASK EST(H):</label>
                            {this.props.status.taskEst}&nbsp;&nbsp;
                            <label>TODO (H):</label>
                            {this.props.status.todo}
                        </CardText>
                    </Card>
                </div>
            )
        }
    });


    var StoryBasic = React.createClass({
        getDefaultProps: function () {
            return {
                basic: {
                    name: '',
                    desc: '',
                    note: '',
                    pm: '',
                    rd: '',
                    fe: '',
                    qa: ''
                }
            };
        },
        click: function () {
            this.props.onCreate({
                name: this.refs.name.value,
                desc: this.refs.desc.value,
                note: this.refs.note.value
            });
        },
        handleChange: function () {
            this.props.basicChange({
                name: this.refs.name.value,
                desc: this.refs.desc.value,
                note: this.refs.note.value,
                pm: this.props.basic.pm,
                rd: this.props.basic.rd,
                fe: this.props.basic.fe,
                qa: this.props.basic.qa
            });
        },
        nameChange: function (e) {
            var basic = this.props.basic;
            basic.name = e.target.value;
            this.props.basicChange(basic);
        },
        descChange: function (e) {
            var basic = this.props.basic;
            basic.desc = e.target.value;
            this.props.basicChange(basic);
        },
        noteChange: function (e) {
            var basic = this.props.basic;
            basic.note = e.target.value;
            this.props.basicChange(basic);
        },
        pmChange: function (value) {
            var basic = this.props.basic;
            basic.pm = value;
            this.props.basicChange(basic);
        },
        rdChange: function (value) {
            var basic = this.props.basic;
            basic.rd = value;
            this.props.basicChange(basic);
        },
        feChange: function (value) {
            var basic = this.props.basic;
            basic.fe = value;
            this.props.basicChange(basic);
        },
        qaChange: function (value) {
            var basic = this.props.basic;
            basic.qa = value;
            this.props.basicChange(basic);
        },
        render: function () {
            var style = {
                width: '600px'
            };
            return (
                <div>
                    <Card>
                        <CardText>
                            <TextField value={this.props.basic.name}
                                       floatingLabelText="Story Name"
                                       style={style}
                                       onChange={this.nameChange}>
                            </TextField>
                            <FlatButton label={this.props.id ? 'Edit Story' : 'Create Story'}
                                        onClick={this.click}
                                        secondary={true}/><br/>
                            <TextField row="10" onChange={this.descChange}
                                       multiLine={true}
                                       rows={4}
                                       rowsMax={10}
                                       floatingLabelText="Description"
                                       style={style}
                                       value={this.props.basic.desc}></TextField> <br/>
                            <TextField onChange={this.noteChange}
                                       multiLine={true}
                                       rows={4}
                                       rowsMax={10}
                                       floatingLabelText="Notes"
                                       style={style}
                                       value={this.props.basic.note}></TextField>
                        </CardText>
                        <CardText>
                            <h3>Owners:</h3>
                            <label>PM:</label>
                            <MemberList value={this.props.basic.pm} onChange={this.pmChange}></MemberList>
                            <label>RD:</label>
                            <MemberList value={this.props.basic.rd} onChange={this.rdChange}></MemberList>
                            <label>FE:</label>
                            <MemberList value={this.props.basic.fe} onChange={this.feChange}></MemberList>
                            <label>QA:</label>
                            <MemberList value={this.props.basic.qa} onChange={this.qaChange}></MemberList>
                        </CardText>
                    </Card>
                </div>
            )
        }
    });

    module.exports = {
        basic: StoryBasic,
        schedule: StorySchedule,
        status: StoryStatus
    };
})();
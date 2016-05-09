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
    var DatePicker = MD.DatePicker;

    var constant = require('./../common/constant');

    /**
     * story schedule include release version, iteration and so on
     */
    var StorySchedule = React.createClass({
        iterationChange: function (e) {
            var schedule = this.props.schedule;
            schedule.iteration = e.target.value;
            this.props.scheduleChange(schedule);
        },
        projectChange: function (value) {
            var schedule = this.props.schedule;
            schedule.project = value;
            this.props.scheduleChange(schedule);
        },
        releaseChange: function (value) {
            var schedule = this.props.schedule;
            schedule.release = value;
            this.props.scheduleChange(schedule);
        },
        render: function () {
            return (
                <div>
                    <Card>
                        <CardText style={constant.cardStyle}>
                            <h3>Story Schedule</h3>
                            <ProjectList onChange={this.projectChange}
                                         floatingLabelText={'Project Name'}
                                         value={this.props.schedule.project}>
                            </ProjectList>
                            <br/>
                            <TextField value={this.props.schedule.iteration}
                                       floatingLabelText="Iteration"
                                       onChange={this.iterationChange}/>
                            <br/>
                            <ReleaseSelect value={this.props.schedule.release}
                                           floatingLabelText={'Release'}
                                           onChange={this.releaseChange}>
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
            var status = this.props.status;
            status.planEst = e.target.value;
            this.props.statusChange(status);
        },
        dateChange: function (oldValue, value) {
            var status = this.props.status;
            if (value) {
                status.testDate = value.getTime();
                this.props.statusChange(status);
            }
        },
        render: function () {
            /**
             * <label>SCHEDULE STATE:</label>{this.props.schedule.state}<br/>
             * <label>STATUS :</label>{this.props.story.state}<br/>
             */
            return (
                <div>
                    <Card >
                        <CardText style={constant.cardStyle}>
                            <h3>Story Status</h3>
                            <TextField value={this.props.status.planEst}
                                       type="number" min="0"
                                       floatingLabelText="PLAN EST(H)"
                                       onChange={this.handleChange}/>
                            <TextField value={this.props.status.taskEst}
                                       type="number" min="0"
                                       floatingLabelText="TASK EST(H)"
                                       disabled={true}/>
                            <TextField value={this.props.status.todo}
                                       type="number" min="0"
                                       floatingLabelText="TODO(H)"
                                       disabled={true}/>
                            <DatePicker
                                floatingLabelText="预计交付时间"
                                value={this.props.status.testDate ? new Date(this.props.status.testDate) : null}
                                onChange={this.dateChange}
                            />
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
            this.props.onCreate();
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
                    <Card >
                        <CardText style={constant.cardStyle}>
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
                                       rows={6}
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
                        <CardText style={constant.cardStyle}>
                            <h3>Owners:</h3>
                            <MemberList value={this.props.basic.pm} onChange={this.pmChange}
                                        floatingLabelText={'PM'}></MemberList>
                            <MemberList value={this.props.basic.rd} onChange={this.rdChange}
                                        floatingLabelText={'RD'}></MemberList>
                            <MemberList value={this.props.basic.fe} onChange={this.feChange}
                                        floatingLabelText={'FE'}></MemberList>
                            <MemberList value={this.props.basic.qa} onChange={this.qaChange}
                                        floatingLabelText={'QA'}></MemberList>
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
/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var ReleaseSelect = require('./../common/releaseSelect');
    var MemberList = require('./../common/memberList');
    var BS = require('react-bootstrap');
    var Button = BS.Button;

    /**
     * story schedule include release version, iteration and so on
     */
    var StorySchedule = React.createClass({
        handleChange: function () {
            var ref = this.refs;
            this.props.scheduleChange(
                ref.project.value,
                ref.iteration.value,
                this.props.schedule.release
            );
        },
        releaseChange: function (value) {
            var ref = this.refs;
            this.props.scheduleChange(
                ref.project.value,
                ref.iteration.value,
                value
            );
        },
        /**
         * @returns {XML}
         */
        render: function () {
            return (
                <div>
                    <section>
                        <h2>Story Schedule</h2>
                        <label>Project Name: </label>
                        <select value={this.props.schedule.project} onChange={this.handleChange}
                                ref="project">
                            <option value="rally">Rrally</option>
                            <option value="haijie">嗨街</option>
                            <option value="dsplug">DSPLUG</option>
                            <option value="social">DSPLUG-social</option>
                        </select>
                        <label>Iteration :</label>
                        <input value={this.props.schedule.iteration} onChange={this.handleChange}
                               ref="iteration"/>
                        <label>Release : </label>
                        <ReleaseSelect value={this.props.schedule.release} onChange={this.releaseChange}>
                        </ReleaseSelect>
                    </section>
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
                this.refs.plan.value,
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
                    <section>
                        <h2>Story Status</h2>
                        <label>PLAN EST(H):</label>
                        <input type="number" min="0" value={this.props.status.planEst}
                               ref="plan"
                               onChange={this.handleChange}/>&nbsp;&nbsp;
                        <label>TASK EST(H):</label>
                        {this.props.status.taskEst}&nbsp;&nbsp;
                        <label>TODO (H):</label>
                        {this.props.status.todo}&nbsp;&nbsp;
                    </section>
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
        pmChange: function (value) {
            this.props.basicChange(this.getChangeData(value, 'pm'));
        },
        rdChange: function (value) {
            this.props.basicChange(this.getChangeData(value, 'rd'));
        },
        feChange: function (value) {
            this.props.basicChange(this.getChangeData(value, 'fe'));
        },
        qaChange: function (value) {
            this.props.basicChange(this.getChangeData(value, 'qa'));
        },
        getChangeData: function (value, field) {
            var data = {
                name: this.refs.name.value,
                desc: this.refs.desc.value,
                note: this.refs.note.value,
                pm: this.props.basic.pm,
                rd: this.props.basic.rd,
                fe: this.props.basic.fe,
                qa: this.props.basic.qa
            };
            data[field] = value;
            return data;
        },
        render: function () {
            var textStyle = {
                width: '600px',
                height: '100px'
            };
            return (
                <div>
                    <form>
                        <labe>Story Name:</labe>
                        <input className="name-input" ref="name" onChange={this.handleChange}
                               value={this.props.basic.name}/>
                        <Button onClick={this.click} bsStyle="primary" bsSize="small">
                            {this.props.id ? 'Edit Story' : 'Create Story'}
                        </Button>

                        <h3>Description:</h3>
                    <textarea row="10" ref="desc" onChange={this.handleChange}
                              value={this.props.basic.desc} style={textStyle}></textarea>
                        <h3>Notes:</h3>
                    <textarea row="10" ref="note" onChange={this.handleChange}
                              value={this.props.basic.note} style={textStyle}></textarea>
                        <h3>Owners:</h3>
                        <label>PM:</label>
                        <MemberList value={this.props.basic.pm} onChange={this.pmChange}></MemberList>
                        <label>RD:</label>
                        <MemberList value={this.props.basic.rd} onChange={this.rdChange}></MemberList>
                        <label>FE:</label>
                        <MemberList value={this.props.basic.fe} onChange={this.feChange}></MemberList>
                        <label>QA:</label>
                        <MemberList value={this.props.basic.qa} onChange={this.qaChange}></MemberList>
                    </form>
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
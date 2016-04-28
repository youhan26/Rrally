/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var ReleaseSelect = require('./../common/releaseSelect');
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
                note: this.refs.note.value
            });
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
                        <input ref="name" onChange={this.handleChange} value={this.props.basic.name}/>
                        <Button onClick={this.click} bsStyle="primary" bsSize="small">
                            {this.props.id ? 'Edit Story' : 'Create Story'}
                        </Button>

                        <h3>Description:</h3>
                    <textarea row="10" ref="desc" onChange={this.handleChange}
                              value={this.props.basic.desc} style={textStyle}></textarea>
                        <h3>Notes:</h3>
                    <textarea row="10" ref="note" onChange={this.handleChange}
                              value={this.props.basic.note} style={textStyle}></textarea>
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
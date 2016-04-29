/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var BS = require('react-bootstrap');
    var Button = BS.Button;
    var BugSelect = require('./../common/bugSelect');

    var Bug = React.createClass({
        getDefaultProps: function () {
            return {
                bug: []
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
            this.props.saveAll();
        },
        onChange: function (data) {
            this.props.onChange(data);
        },
        addBug: function () {
            this.props.onAdd();
        },
        render: function () {
            return (
                <div>
                    {this.props.bug.map(this.renderItem)}
                    <Button onClick={this.addBug}>Add Bug</Button>
                    <Button onClick={this.saveBug}>Save Bug</Button>
                </div>
            )
        }
    });

    var BugItem = React.createClass({
        getDefaultProps: function () {
            return {
                name: '',
                step: '',
                status: 1
            }
        },
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
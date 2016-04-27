/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var BS = require('react-bootstrap');

    var Task = React.createClass({
        renderItem: function (item) {
            return <BS.Well key={item.id}>
                <TaskItem task={item} onChange={this.onChange}></TaskItem>
            </BS.Well>
        },
        saveTask: function (task) {
            this.props.saveAll(task);
        },
        onChange: function (task) {
            this.props.onChange(task);
        },
        addTask: function () {
            this.props.onAdd();
        },
        render: function () {
            return (
                <div>
                    {this.props.task.map(this.renderItem)}
                    <BS.Button onClick={this.addTask}>Add Task</BS.Button>
                    <BS.Button onClick={this.saveTask}>Save Task</BS.Button>
                </div>
            )
        }
    });

    var TaskItem = React.createClass({
        handleChange: function () {
            this.props.onChange({
                id: this.props.task.id,
                name: this.refs.name.value,
                est: parseFloat(this.refs.est.value),
                todo: parseFloat(this.refs.todo.value),
                updateTime: new Date().getTime()
            });
        },
        render: function () {
            var style = {
                width: '400px'
            };
            return (
                <div>
                    <label>Task Name:</label>
                    <input value={this.props.task.name} onChange={this.handleChange} ref="name" style={style}/>
                    &nbsp;&nbsp;
                    <label>Task Est:</label>
                    <input value={this.props.task.est} onChange={this.handleChange} ref="est" type="number"/>
                    &nbsp;&nbsp;
                    <label>Task todo:</label>
                    <input value={this.props.task.todo} onChange={this.handleChange} ref="todo" type="number"/>
                </div>
            )
        }
    });
    module.exports = Task;
})();
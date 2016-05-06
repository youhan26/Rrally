/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var MD = require('material-ui');
    var TextField = MD.TextField;
    var FlatButton = MD.FlatButton;
    var CardText = MD.CardText;
    var Card = MD.Card;

    var Task = React.createClass({
        renderItem: function (item) {
            return <TaskItem task={item} key={item.id} onChange={this.onChange}></TaskItem>;
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
                    <FlatButton onClick={this.addTask}>Add Task</FlatButton>
                    <FlatButton onClick={this.saveTask} secondary={true}>Save Task</FlatButton>
                </div>
            )
        }
    });

    var TaskItem = React.createClass({
        nameChange: function (e) {
            var task = this.props.task;
            task.name = e.target.value;
            this.props.onChange(task);
        },
        estChange: function (e) {
            var task = this.props.task;
            task.est = parseFloat(e.target.value);
            this.props.onChange(task);
        },
        todoChange: function (e) {
            var task = this.props.task;
            task.todo = parseFloat(e.target.value);
            this.props.onChange(task);
        },
        render: function () {
            var style = {
                width: '500px'
            };
            return (
                <div>
                    <Card>
                        <CardText>
                            <TextField value={this.props.task.name} onChange={this.nameChange}
                                       floatingLabelText="Task Name"
                                       style={style}/>
                            <TextField value={this.props.task.est} onChange={this.estChange}
                                       type="number"
                                       floatingLabelText="Task Est"/>
                            <TextField value={this.props.task.todo} onChange={this.todoChange}
                                       type="number"
                                       floatingLabelText="Task todo"/>
                        </CardText>
                    </Card>
                </div>
            )
        }
    });
    module.exports = Task;
})();
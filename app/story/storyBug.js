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
    var BugSelect = require('./../common/customerList').BugList;

    var Bug = React.createClass({
        getDefaultProps: function () {
            return {
                bug: []
            }
        },
        renderItem: function (item) {
            return (
                <BugItem bug={item} onChange={this.onChange} key={item.id}></BugItem>
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
                    <FlatButton onClick={this.addBug}>Add Bug</FlatButton>
                    <FlatButton onClick={this.saveBug} secondary={true}>Save Bug</FlatButton>
                </div>
            )
        }
    });

    var BugItem = React.createClass({
        statusChange: function (value) {
            var bug = this.props.bug;
            bug.status = value;
            this.props.onChange(bug);
        },
        nameChange: function (e) {
            var bug = this.props.bug;
            bug.name = e.target.value;
            this.props.onChange(bug);
        },
        stepChange: function (e) {
            var bug = this.props.bug;
            bug.step = e.target.value;
            this.props.onChange(bug);
        },

        render: function () {
            var style = {
                width: '500px'
            };
            return (
                <div>
                    <Card>
                        <CardText>
                            <TextField value={this.props.bug.name} onChange={this.nameChange}
                                       floatingLabelText="Bug Name"/>
                            <br/>
                            <TextField onChange={this.stepChange}
                                       multiLine={true}
                                       rows={4}
                                       floatingLabelText="Step"
                                       style={style}
                                       value={this.props.bug.step}></TextField>
                            <br/>
                            <BugSelect value={this.props.bug.status} onChange={this.statusChange}
                                       floatingLabelText="Bug Status">
                            </BugSelect>
                        </CardText>
                    </Card>

                </div>
            )
        }
    });
    module.exports = Bug;
})();
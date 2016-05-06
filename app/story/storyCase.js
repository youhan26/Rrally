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

    var Case = React.createClass({
        renderItem: function (item) {
            return (
                <CaseItem case={item} onChange={this.onChange} key={item.id}></CaseItem>
            );
        },
        saveCase: function (data) {
            this.props.saveAll(data);
        },
        onChange: function (data) {
            this.props.onChange(data);
        },
        addCase: function () {
            this.props.onAdd();
        },
        render: function () {
            return (
                <div>
                    {this.props.case.map(this.renderItem)}
                    <FlatButton onClick={this.addCase}>Add Case</FlatButton>
                    <FlatButton onClick={this.saveCase} secondary={true}>Save Case</FlatButton>
                </div>
            )
        }
    });

    var CaseItem = React.createClass({
        nameChange: function (e) {
            var item = this.props.case;
            item.name = e.target.value;
            this.props.onChange(item);
        },
        stepChange: function (e) {
            var item = this.props.case;
            item.step = e.target.value;
            this.props.onChange(item);
        },
        expcChange: function (e) {
            var item = this.props.case;
            item.expc = e.target.value;
            this.props.onChange(item);
        },
        actualChange: function (e) {
            var item = this.props.case;
            item.actual = e.target.value;
            this.props.onChange(item);
        },
        render: function () {
            var style = {
                width: '500px'
            };
            return (
                <div>
                    <Card>
                        <CardText>
                            <TextField value={this.props.case.name} onChange={this.nameChange}
                                       floatingLabelText="Case Name"/>
                            <br/>
                            <TextField onChange={this.stepChange}
                                       multiLine={true}
                                       rows={4}
                                       floatingLabelText="Step"
                                       style={style}
                                       value={this.props.case.step}></TextField>
                            <br/>
                            <TextField value={this.props.case.expc} onChange={this.expcChange}
                                       floatingLabelText="Expected Result"/>
                            <TextField value={this.props.case.actual} onChange={this.actualChange}
                                       floatingLabelText="Actual Result"/>
                        </CardText>
                    </Card>
                </div>
            )
        }
    });
    module.exports = Case;
})();
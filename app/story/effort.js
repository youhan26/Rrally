/**
 * Created by YouHan on 2016/5/9.
 */

var React = require('react');

var MD = require('material-ui');
var Table = MD.Table;
var TableHeader = MD.TableHeader;
var TableRow = MD.TableRow;
var TableHeaderColumn = MD.TableHeaderColumn;
var TableRowColumn = MD.TableRowColumn;
var TableBody = MD.TableBody;

var Effort = React.createClass({
    renderLi: function (item) {
        return (
            <TableRow hoverable={true} key={item.id}>
                <TableRowColumn>{item.member}</TableRowColumn>
                <TableRowColumn>{item.est}</TableRowColumn>
                <TableRowColumn>{item.todo}</TableRowColumn>
            </TableRow>
        );
    },
    render: function () {
        var style = {
            'height': '400px'
        };
        return (
            <div style={style}>
                <Table>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Member Name</TableHeaderColumn>
                            <TableHeaderColumn>Task Est</TableHeaderColumn>
                            <TableHeaderColumn>Task Todo</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={true}>
                        {this.props.items.map(this.renderLi)}
                    </TableBody>
                </Table>
            </div>
        )
    }
});

module.exports = Effort;
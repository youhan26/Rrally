/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
var Firebase = require('firebase');
var constant = require('./../common/config');
var List = require('./../common/customerList');
var api = require('./../common/api');
var supp = require('./../common/supporting');
var Sortable = require('./../widgets/sortable/Sortable.min');
var SortableMixin = require('./../widgets/sortable/react-sortable-mixin');

var Project = List.ProjectList;

var MD = require('material-ui');
var Table = MD.Table;
var TableHeader = MD.TableHeader;
var TableRow = MD.TableRow;
var TableHeaderColumn = MD.TableHeaderColumn;
var TableRowColumn = MD.TableRowColumn;
var TableBody = MD.TableBody;
var RaisedButton = MD.RaisedButton;


var StoryList = React.createClass({
    getInitialState: function () {
        this.dragEl = null;
        this.dragItem = null;
        return {
            items: []
        }
    },
    loadData: function () {
        this.firebaseRef.once('value', function (snap) {
            var data = snap.val();
            var items = [];
            for (var i in data) {
                if (data[i].schedule.release == ''
                    && (this.curProject === 999 ||
                    (data[i].schedule.project.toString() == this.curProject.toString()))) {
                    items.push(data[i]);
                }
            }
            items.sort(function (a, b) {
                if (a.index && b.index) {
                    if (a.index < b.index) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else {
                    if (a.id < b.id) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            });
            this.setState({
                items: items
            });
        }.bind(this));
    },
    componentWillMount: function () {
        var me = this;
        me.firebaseRef = new Firebase(constant.story);
        me.style = {
            width: '35%'
        };
        me.style2 = {
            width: '15%'
        };
        me.curProject = 999;
        supp.load.then(function () {
            me.loadData();
        });
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    projectChange: function (value) {
        this.curProject = value;
        this.loadData();
    },
    _updateDrag: function (el, item) {
        this.dragEl = el;
        this.dragItem = item;
    },
    renderLi: function (item, index) {
        return (
            <SortListItem item={item} index={index} key={item.id} dragEl={this.dragEl}
                          updateDrag={this._updateDrag}></SortListItem>
        );
    },
    render: function () {
        return (
            <div>
                <Project value={this.curProject} onChange={this.projectChange}
                         floatingLabelText={'Select Project'}></Project>
                <Table>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Story ID</TableHeaderColumn>
                            <TableHeaderColumn style={this.style}>Story Name</TableHeaderColumn>
                            <TableHeaderColumn style={this.style2}>Plan Est</TableHeaderColumn>
                            <TableHeaderColumn>Project / PM Owner</TableHeaderColumn>
                            <TableHeaderColumn>Operation</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={true}>
                        {this.state.items.map(this.renderLi)}
                    </TableBody>
                </Table>
            </div>
        )
    }
});

var SortListItem = React.createClass({
    getProjectById: function (id) {
        return supp.getNameById('project', id);
    },
    getPmById: function (id) {
        return supp.getNameById('member', id);
    },
    _updateDrag: function (el) {
        this.props.updateDrag(el, this.props.item);
    },
    componentDidMount: function () {
        var me = this;
        var el = this.getDOMNode();
        el.draggable = true;
        el.addEventListener('dragstart', function (e) {
            var dragEl = e.target; // Remembering an element that will be moved

            // Limiting the movement type
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('Custom', JSON.stringify(me.props.item));

            me._updateDrag(dragEl);

            // Subscribing to the events at dnd
            el.addEventListener('dragover', me._onDragOver, false);
            el.addEventListener('dragend', me._onDragEnd, false);

            setTimeout(function () {
                dragEl.classList.add('ghost');
            }, 0)

        }, false);
    },
    _onDragOver: function (e) {
        debugger;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // var target = e.target;
        // if (target && target !== dragEl && target.nodeName == 'LI') {
        //     // Sorting
        //     rootEl.insertBefore(dragEl, target.nextSibling || target);
        // }
    },
    _onDragEnd: function (e) {
        debugger;
        e.preventDefault();
        var dragEl = e.target;
        dragEl.classList.remove('ghost');
        el.removeEventListener('dragover', _onDragOver, false);
        el.removeEventListener('dragend', _onDragEnd, false);
        // Notification about the end of sorting
        // onUpdate(dragEl);
    },
    render: function () {
        return (
            <TableRow hoverable={true}>
                <TableRowColumn>
                    <a href={'../story/story.html?id=' + this.props.item.storyId} target="_blank">
                        {this.props.item.storyId}
                    </a>
                </TableRowColumn>
                <TableRowColumn style={this.style}>{this.props.item.basic.name}</TableRowColumn>
                <TableRowColumn style={this.style2}>{this.props.item.status.planEst}</TableRowColumn>
                <TableRowColumn>
                    {this.getProjectById(this.props.item.schedule.project) || '无'}
                    / {this.getPmById(this.props.item.basic.pm) || '无'}
                </TableRowColumn>
                <TableRowColumn>
                    <i className="fa fa-sort my-handle" aria-hidden="true"></i>
                </TableRowColumn>
            </TableRow>
        )
    }
});


var el = document.getElementById('backlog');
if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}
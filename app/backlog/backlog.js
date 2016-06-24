/**
 * Created by youha on 4/12/2016.
 */
'use strict';
var React = require('react');
var ReactDOM = require('react-dom');
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
var Snackbar = MD.Snackbar;


var StoryList = React.createClass({
    getInitialState: function () {
        return {
            items: [],
            open: false
        }
    },
    loadData: function (showAlert) {
        var me = this;
        api.story.get().then(function (snap) {
            var data = snap.val();
            //for the drag
            me.dataset = data;
            //store the temp drag data
            me.tempstore = [];
            var items = [];
            for (var i in data) {
                if (data[i].schedule.release == ''
                    && (me.curProject === 999 ||
                    (data[i].schedule.project.toString() == me.curProject.toString()))) {
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
            me.setState({
                items: items
            });
            if (showAlert) {
                me.setState({
                    open: true
                });
            }
        });
    },
    componentWillMount: function () {
        var me = this;
        me.curProject = 999;
        supp.load.then(function () {
            me.loadData();
        });
    },
    componentWillUnmount: function () {
    },
    projectChange: function (value) {
        this.curProject = value;
        this.loadData();
    },
    _update: function () {
        var me = this;
        var list = me.tempstore;
        var len = list.length;
        var index = 0;
        for (var i = 0, ii = len; i < ii; i++) {
            api.story.update(list[i].storyId, {
                index: list[i].index
            }).then(function () {
                if (++index === len) {
                    me.loadData(true);
                }
            });
        }
    },
    _refresh: function (f, t) {
        var me = this;
        var from = me.dataset[f],
            to = me.dataset[t],
            flagf = false,
            flagt = false;
        var list = me.tempstore;
        var t = from.index;
        from.index = to.index;
        to.index = t;
        for (var i = 0, ii = list.length; i < ii; i++) {
            if (list[i].storyId === from.storyId) {
                list[i].index = from.index;
                flagf = true;
            }
            if (list[i].storyId === to.storyId) {
                list[i].index = to.index;
                flagt = true;
            }
        }
        if (!flagf) {
            me.tempstore.push({
                storyId: from.storyId,
                index: from.index
            });
        }
        if (!flagt) {
            me.tempstore.push({
                storyId: to.storyId,
                index: to.index
            });
        }
        var temp = [];
        for (var i = 0, ii = list.length; i < ii; i++) {
            temp.push(list[i].index);
        }
        console.log(temp.toString());
    },
    onRequestClose: function () {
        this.setState({
            open: false
        });
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
                </Table>
                <SortList items={this.state.items} update={this._update} refresh={this._refresh}></SortList>
                <Snackbar
                    open={this.state.open}
                    message="save succ"
                    autoHideDuration={1000}
                    onRequestClose={this.onRequestClose}
                />
            </div>
        )
    }
});

var SortList = React.createClass({
    _getProjectById: function (id) {
        return supp.getNameById('project', id);
    },
    _getPmById: function (id) {
        return supp.getNameById('member', id);
    },
    mixins: [SortableMixin],
    componentWillMount: function () {
        var me = this;
        me.sortableOptions = {
            me: me,
            ghostClass: 'ghost',
            onMove: function (e) {
                var from = e.dragged.firstChild.textContent,
                    to = e.related.firstChild.textContent;
                me.props.refresh(from, to) && this.options.me.props.refresh(from, to);
            },
            onEnd: function (evt) {
                me.props.update() && this.options.me.props.update();
            }
        };
    },
    _renderLi: function (item, index) {
        return (
            <div className={index%2==0 ? 'story-list' : 'story-list-gray'} key={item.id}>
                <div className="story-num">
                    <a href={'../story/story.html?id=' + item.storyId} target="_blank">
                        {item.storyId}
                    </a>
                </div>
                <div className="story-name">
                    {item.basic.name}
                </div>
                <div className="story-plan">
                    {item.status.planEst}
                </div>
                <div className="story-project">
                    {this._getProjectById(item.schedule.project) || '无'}
                    / {this._getPmById(item.basic.pm) || '无'}
                </div>
            </div>
        )
    },
    render: function () {
        return (
            <div>
                {this.props.items.map(this._renderLi)}
            </div>
        )
    }
});


var el = document.getElementById('backlog');
if (el) {
    ReactDOM.render(React.createElement(StoryList, null), el);
}
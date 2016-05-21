/**
 * Created by YouHan on 2016/5/19.
 */

(function () {
    'use strict';
    var React = require('react');
    var ReactDOM = require('react-dom');
    var Firebase = require('firebase');
    var constant = require('./../common/config');
    var injectTapEventPlugin = require("react-tap-event-plugin");

    var MD = require('material-ui');
    var AutoComplete = MD.AutoComplete;
    var Divider = MD.Divider;
    var List = MD.List;
    var ListItem = MD.ListItem;
    var FlatButton = MD.FlatButton;


    injectTapEventPlugin();

    var manage = React.createClass({
        getInitialState: function () {
            this.lists = [{
                id: 1,
                name: '222'
            }, {
                id: 2,
                name: '22233'
            }];
            return {
                modules: ['project', 'bug', 'member', 'release']
            }
        },
        moduleChange: function (value) {
            this.module = value;
        },
        del: function (item) {
            //TODO
            console.log(item);
        },
        render: function () {
            return (
                <div>
                    <AutoComplete
                        onUpdateInput={this.moduleChange}
                        onNewRequest={this.moduleChange}
                        floatingLabelText="Module Name"
                        filter={AutoComplete.noFilter}
                        openOnFocus={true}
                        dataSource={this.state.modules}
                    />
                    <ResultList value={this.lists} onDel={this.del}></ResultList>
                </div>
            )
        }
    });

    var ResultList = React.createClass({
        renderLi: function (item) {
            var button = (
                <FlatButton label="删除" primary={true} onClick={this.props.onDel(item)}/>
            );
            return (
                <div key={item.id}>
                    <ListItem primaryText={item.name} rightIconButton={button}>
                    </ListItem>
                    <Divider />
                </div>
            );
        },
        render: function () {
            return (
                <div>
                    <List>
                        {this.props.value.map(this.renderLi)}
                    </List>
                </div>
            )
        }
    });


    var el = document.getElementById('manage');
    if (el) {
        ReactDOM.render(React.createElement(manage, null), el);
    }
})();
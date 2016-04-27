/**
 * Created by YouHan on 2016/4/27.
 */

(function () {

    var React = require('react');

    var ReleaseSelect = React.createClass({
        onChange: function () {
            if (this.props.onChange) {
                this.props.onChange(this.refs.release.value);
            }
        },
        getInitialState: function () {
            return {
                items: [{
                    id: 1,
                    name: 'Open(激活)'
                }, {
                    id: 2,
                    name: 'Fixed（本地修复）'
                }, {
                    id: 3,
                    name: 'Close(关闭)'
                }]
            };
        },
        render: function () {
            function renderItem(item) {
                return <option key={item.id} value={item.id}>{item.name}</option>;
            }

            return (
                <select value={this.props.value} onChange={this.onChange} ref="status">
                    {this.state.items.map(renderItem)}
                </select>
            )
        }
    });

    module.exports = ReleaseSelect;
})();
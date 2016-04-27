/**
 * Created by YouHan on 2016/4/27.
 */
(function () {
    var React = require('react');
    var BS = require('react-bootstrap');

    var Case = React.createClass({
        renderItem: function (item) {
            return (
                <BS.Well key={item.id}>
                    <CaseItem case={item} onChange={this.onChange}></CaseItem>
                </BS.Well>
            )
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
                    <BS.Button onClick={this.addCase}>Add Case</BS.Button>
                    <BS.Button onClick={this.saveCase}>Save Case</BS.Button>
                </div>
            )
        }
    });

    var CaseItem = React.createClass({
        handleChange: function () {
            this.props.onChange({
                id: this.props.case.id,
                name: this.refs.name.value,
                step: this.refs.step.value,
                expc: this.refs.expc.value,
                actual: this.refs.actual.value,
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
                    <label>Case Name: </label>
                    <input value={this.props.case.name} onChange={this.handleChange} ref="name"/>
                    <br/>
                    <div style={divStyle}>
                        <label>Step: </label>
                        <textarea value={this.props.case.step} onChange={this.handleChange} ref="step" style={style}/>
                    </div>

                    <div style={divStyle}>
                        <label>Expected Result : </label>
                        <textarea value={this.props.case.expc} onChange={this.handleChange} ref="expc" style={style}/>
                    </div>

                    <div style={divStyle}>
                        <label>Actual Result : </label>
                        <textarea value={this.props.case.actual} onChange={this.handleChange} ref="actual"
                                  style={style}/>
                    </div>
                </div>
            )
        }
    });
    module.exports = Case;
})();
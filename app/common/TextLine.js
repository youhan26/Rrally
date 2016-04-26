/**
 * Created by YouHan on 2016/4/26.
 */
(function () {
    var TextLine = React.createClass({
        render: function () {
            var lines = this.props.lines;
            var lineMap = lines.split('\n');

            function wrap(item) {
                var data = Math.random() * 10000;
                return <p key={data}>{item}</p>;
            }

            return (
                <div>
                    {lineMap.map(wrap)}
                </div>
            );
        }

    });

    module.exports = TextLine;
})();
var TextBox = require('./text-box');

module.exports = Literal;

var base_text_attrs = {
        'font-size': 12
    },
    base_rect_attrs = {
        r: 3,
        fill: '#dae9e5',
        stroke: '#dae9e5'
    };

function Literal(paper, structure) {
    TextBox.call(this, paper, '"' + structure.content + '"',
        base_text_attrs, base_rect_attrs);
}

Literal.prototype = Object.create(TextBox.prototype);
Literal.prototype.constructor = Literal;
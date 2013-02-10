var Raphael = require('./raphael');

//N.B. must not use `module.exports =` after requiring in the tags as there is a cyclic dependancy

var tags = {
    any_character: require('./regexper/any-character'),
    charset: require('./regexper/charset'),
    escaped: require('./regexper/escaped'),
    literal: require('./regexper/literal'),
    match: require('./regexper/match'),
    range: require('./regexper/range'),
    regexp: require('./regexper/regexp'),
    repetition: require('./regexper/repetition'),
    subexp: require('./regexper/subexp')
};

var base_path_attrs = {
        'stroke-width': 2
    },
    base_anchor_attrs = {
        fill: '#6b6659',
        'stroke-width': 2
    };

exports.draw = draw;
function draw(paper_container, data, callback) {
    Raphael(paper_container, 2, 2, function () {
        var paper = this;
        try {
            render(paper, data.structure, function(expression) {
                var box, offset,
                    x = 20,
                    y = 10;

                expression.stack();
                expression.position(20, 10);

                box = expression.get_box();
                offset = expression.get_connection_offset();

                draw_anchor(paper, 10, box.y + offset, box.x);
                draw_anchor(paper, box.x2 + 10, box.y + offset, box.x2);

                paper.setSize(box.width + 40, box.height + 20);

                callback();
            });
        } catch (ex) {
            callback(ex);
        }
    });
};

exports.render = render;
function render(paper, structure, callback) {
    try {
        var Tag = tags[structure.type];
        var tag = new Tag(paper, structure);
        tag.complete(function() {
            callback(tag);
        });
    } catch (ex) {
        try { console.log(structure.type) } catch (e) { }
        throw ex;
    }
}

exports.draw_anchor = draw_anchor;
function draw_anchor(paper, x, y, connection) {
    paper.path(Raphael.fullfill('M{start.x},{start.y}H{end}', {
        start: {
            x: x,
            y: y
        },
        end: connection
    })).attr(base_path_attrs);

    paper.circle(x, y, 5).attr(base_anchor_attrs);
}

exports.render_contents = render_contents;
function render_contents(paper, contents, complete) {
    function content_complete(index) {
        return function(element) {
            result[index] = element;
            count--;

            if (count === 0) {
                complete(result);
            }
        }
    }

    var i,
        count = contents.length,
        result = [];

    if (count === 0) {
        complete(result);
    }

    for (i = 0; i < contents.length; i++) {
        exports.render(paper, contents[i], content_complete(i));
    }
}

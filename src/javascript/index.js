var Renderer = require('./renderer');
var RegexperClasses = require('./grammerClasses');
var RegexperParser = require('./regexpGrammer').Parser;

for (var k in RegexperClasses) {
    RegexperParser[k] = RegexperClasses[k];
}

module.exports = render;

function render(paper_container, regexp, callback) {
    RegexperParser.Subexp.capture_group = 1;

    try {
        var tree = RegexperParser.parse(regexp)
        if (!tree) {
            throw new Error('No tree produced');
        }
        var obj = tree.to_obj();  
    }
    catch(e) {
        try {
            e.name += ' Prasing RegExp';
        } catch (ex) {}
        return callback(e);
    }
    
    Renderer.draw(paper_container, {"raw_expr":regexp,"structure":obj}, function (e) {
        if (e) e.name += ' Drawing Tree';
        callback(e);
    });
}
"use strict";

/*
This script converts CCDA data in JSON format (originally generated from a Continuity of Care Document (CCD) in
standard XML/CCDA format) back to XML/CCDA format.
*/

const bbu = require("blue-button-util");

const engine = require('./lib/engine');
const documentLevel = require('./lib/documentLevel');

const bbuo = bbu.object;

const html_renderer = require('./lib/htmlHeaders');

const createContext = (function () {
    const base = {
        nextReference: function (referenceKey) {
            let index = this.references[referenceKey] || 0;
            ++index;
            this.references[referenceKey] = index;
            return "#" + referenceKey + index;
        },
        sameReference: function (referenceKey) {
            const index = this.references[referenceKey] || 0;
            return "#" + referenceKey + index;
        }
    };

    return function (options) {
        const result = Object.create(base);
        result.references = {};
        if (options.meta && options.addUniqueIds) {
            result.rootId = bbuo.deepValue(options.meta, 'identifiers.0.identifier');
        } else {
            result.rootId = null;
        }
        result.preventNullFlavor = options.preventNullFlavor;

        return result;
    };
})();

const generate = exports.generate = function (template, input, options) {
    if (!options.html_renderer) {
        options.html_renderer = html_renderer;
    }

    const context = createContext(options);
    return engine.create(documentLevel.ccd2(options.html_renderer), input, context);
};

exports.generateCCD = function (input, options) {
    options = options || {};
    options.meta = input.meta;
    return generate(documentLevel.ccd, input, options);
};

exports.fieldLevel = require("./lib/fieldLevel");
exports.entryLevel = require("./lib/entryLevel");
exports.leafLevel = require('./lib/leafLevel');
exports.contentModifier = require("./lib/contentModifier");
exports.condition = require('./lib/condition');

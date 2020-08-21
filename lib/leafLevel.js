"use strict";

const bbu = require("blue-button-util");
const translate = require('./translate');

exports.input = function (input) {
    return input;
};

exports.inputProperty = function (key) {
    return function (input) {
        return input && input[key];
    };
};

exports.boolInputProperty = function (key) {
    return function (input) {
        if (input && input.hasOwnProperty(key)) {
            return input[key].toString();
        } else {
            return null;
        }
    };
};

exports.code = translate.code;

exports.codeFromName = translate.codeFromName;

exports.codeOnlyFromName = function (OID, key) {
    const f = translate.codeFromName(OID);
    return function (input) {
        if (input && input[key]) {
            return f(input[key]).code;
        } else {
            return null;
        }
    };
};

exports.time = translate.time;

exports.use = function (key) {
    return function (input) {
        const value = input && input[key];
        if (value) {
            return translate.acronymize(value);
        } else {
            return null;
        }
    };
};

exports.typeCD = {
    "xsi:type": "CD"
};

exports.typeCE = {
    "xsi:type": "CE"
};

exports.nextReference = function (referenceKey) {
    return function (input, context) {
        return context.nextReference(referenceKey);
    };
};

exports.sameReference = function (referenceKey) {
    return function (input, context) {
        return context.sameReference(referenceKey);
    };
};

exports.deepInputProperty = function (deepProperty, defaultValue) {
    return function (input) {
        let value = bbu.object.deepValue(input, deepProperty);
        value = bbu.object.exists(value) ? value : defaultValue;
        if (typeof value !== 'string') {
            value = value.toString();
        }
        return value;
    };
};

exports.deepInputDate = function (deepProperty, defaultValue) {
    return function (input) {
        let value = bbu.object.deepValue(input, deepProperty);
        if (!bbu.object.exists(value)) {
            return defaultValue;
        } else {
            value = bbu.datetime.modelToDate({
                date: value.date,
                precision: value.precision // workaround a bug in bbud.  Changes precision.
            });
            if (bbu.object.exists(value)) {
                return value;
            } else {
                return defaultValue;
            }
        }
    };
};

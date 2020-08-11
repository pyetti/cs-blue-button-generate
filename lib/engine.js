"use strict";

const xmlutil = require('./xmlutil');

const expandText = function (input, template) {
    var text = template.text;
    if (text) {
        if (typeof text === 'function') {
            text = text(input);
        }
        if ((text !== null) && (text !== undefined)) {
            return text;
        }
    }
    return null;
};

const expandAttributes = function expandAttributes(input, context, attrObj, attrs) {
    if (Array.isArray(attrObj)) {
        attrObj.forEach(function (attrObjElem) {
            expandAttributes(input, context, attrObjElem, attrs);
        });
    } else if (typeof attrObj === 'function') {
        expandAttributes(input, context, attrObj(input, context), attrs);
    } else {
        Object.keys(attrObj).forEach(function (attrKey) {
            var attrVal = attrObj[attrKey];
            if (typeof attrVal === 'function') {
                attrVal = attrVal(input, context);
            }
            if ((attrVal !== null) && (attrVal !== undefined)) {
                attrs[attrKey] = attrVal;
            }
        });
    }
};

const fillAttributes = function (node, input, context, template) {
    const attrObj = template.attributes;
    if (attrObj) {
        const inputAttrKey = template.attributeKey;
        if (inputAttrKey) {
            input = input[inputAttrKey];
        }
        if (input) {
            const attrs = {};
            expandAttributes(input, context, attrObj, attrs);
            xmlutil.nodeAttr(node, attrs);
        }
    }
};

const fillContent = function (node, input, context, template) {
    let content = template.content;
    if (content) {
        if (!Array.isArray(content)) {
            content = [content];
        }
        content.forEach(function (element) {
            if (Array.isArray(element)) {
                const actualElement = Object.create(element[0]);
                for (let i = 1; i < element.length; ++i) {
                    element[i](actualElement);
                }
                update(node, input, context, actualElement);
            } else {
                update(node, input, context, element);
            }
        });
    }
};

const updateUsingTemplate = function updateUsingTemplate(xmlDoc, input, context, template) {
    const condition = template.existsWhen;
    if ((!condition) || condition(input, context)) {
        const name = template.key;
        const text = expandText(input, template);
        if (((text !== null) && (text !== undefined)) || template.content || template.attributes) {
            const node = xmlutil.newNode(xmlDoc, name, text);

            fillAttributes(node, input, context, template);
            fillContent(node, input, context, template);
            return true;
        }
    }
    return false;
};

const transformInput = function (input, template) {
    const inputKey = template.dataKey;
    if (inputKey) {
        const pieces = inputKey.split('.');
        pieces.forEach(function (piece) {
            if (Array.isArray(input) && (piece !== "0")) {
                const nextInputs = [];
                input.forEach(function (inputElement) {
                    const nextInput = inputElement[piece];
                    if (nextInput) {
                        if (Array.isArray(nextInput)) {
                            nextInput.forEach(function (nextInputElement) {
                                if (nextInputElement) {
                                    nextInputs.push(nextInputElement);
                                }
                            });
                        } else {
                            nextInputs.push(nextInput);
                        }
                    }
                });
                if (nextInputs.length === 0) {
                    input = null;
                } else {
                    input = nextInputs;
                }
            } else {
                input = input && input[piece];
            }
        });
    }
    if (input) {
        const transform = template.dataTransform;
        if (transform) {
            input = transform(input);
        }
    }
    return input;
};

const update = exports.update = function (xmlDoc, input, context, template) {
    let filled = false;
    if (input) {
        input = transformInput(input, template);
        if (input) {
            if (Array.isArray(input)) {
                input.forEach(function (element) {
                    filled = updateUsingTemplate(xmlDoc, element, context, template) || filled;
                });
            } else {
                filled = updateUsingTemplate(xmlDoc, input, context, template);
            }
        }
    }
    if ((!filled) && template.required && !context.preventNullFlavor) {
        const node = xmlutil.newNode(xmlDoc, template.key);
        xmlutil.nodeAttr(node, {
            nullFlavor: 'UNK'
        });
    }
};

exports.create = function (template, input, context) {
    const doc = new xmlutil.newDocument();
    update(doc, input, context, template);
    return xmlutil.serializeToString(doc);
};

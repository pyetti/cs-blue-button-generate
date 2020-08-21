"use strict";

const bbu = require("blue-button-util");
const condition = require('./condition');
const leafLevel = require('./leafLevel');
const sectionHeaders = require('./sectionTextHeaders');

const nda = "No Data Available";

const getText = function (topArrayKey, headers, values) {
    const result = {
        key: "text",
        existsWhen: condition.keyExists(topArrayKey),

        content: [{
            key: "table",
            attributes: {
                border: "1",
                width: "100%"
            },
            content: [{
                key: "thead",
                content: [{
                    key: "tr",
                    content: []
                }]
            }, {
                key: "tbody",
                content: [{
                    key: "tr",
                    content: [],
                    dataKey: topArrayKey
                }]
            }]
        }]
    };
    const headerTarget = result.content[0].content[0].content[0].content;
    headers.forEach(function (header) {
        const element = {
            key: "th",
            text: header
        };
        headerTarget.push(element);
    });
    const valueTarget = result.content[0].content[1].content[0].content;
    values.forEach(function (value) {
        let data;
        if (typeof value !== 'function') {
            data = leafLevel.deepInputProperty(value, "");
        } else {
            data = value;
        }

        const element = {
            key: "td",
            text: data
        };
        valueTarget.push(element);
    });
    return result;
};

exports.allergiesSectionEntriesRequiredHtmlHeader = getText('allergies', sectionHeaders.allergiesTextHeaders, [
    leafLevel.deepInputProperty("observation.allergen.name", ""),
    leafLevel.deepInputProperty("observation.severity.code.name", ""),
    leafLevel.deepInputProperty("observation.reactions.0.reaction.name", ""),
    leafLevel.deepInputProperty("observation.reactions.0.severity.code.name", ""),
    leafLevel.deepInputProperty("observation.status.name", "")
]);

exports.medicationsSectionEntriesRequiredHtmlHeader = getText('medications', sectionHeaders.medicationsTextHeaders, [
    extracted_date_time(),
    leafLevel.deepInputProperty("supply.repeatNumber", ""),
    leafLevel.deepInputDate("supply.date_time.point", "")
]);

exports.problemsSectionEntriesRequiredHtmlHeader = getText('problems', sectionHeaders.problemsTextHeaders, [
    leafLevel.deepInputProperty("problem.code.name", ""),
    leafLevel.deepInputProperty("problem.severity.code.name", "")
]);

exports.proceduresSectionEntriesRequiredHtmlHeader = getText('procedures', sectionHeaders.proceduresHeaders, [
    leafLevel.deepInputProperty("procedure.name", ""),
    leafLevel.deepInputProperty("procedure.code", ""),
    leafLevel.deepInputDate("date_time.point", ""),
    leafLevel.deepInputProperty("performer.0.organization.0.name.0", ""),
    leafLevel.deepInputProperty("performer.0.organization.0.phone.0.value.number", "")
]);

exports.resultsSectionEntriesRequiredHtmlHeader = getText('results', sectionHeaders.resultsHeaders, [
    leafLevel.deepInputProperty("result_set.name", ""),
    leafLevel.deepInputProperty("result.name", ""),
    leafLevel.deepInputProperty("value", ""),
    leafLevel.deepInputProperty("unit", ""),
    leafLevel.deepInputProperty("reference_range.low", ""),
    leafLevel.deepInputProperty("reference_range.high", ""),
    leafLevel.deepInputDate("date_time.point", "")
]);

exports.encountersSectionEntriesOptionalHtmlHeader = getText('encounters', sectionHeaders.encountersHeaders, [
    leafLevel.deepInputProperty("encounter.name", ""),
    leafLevel.deepInputProperty("locations.0.name", ""),
    extracted_date_time(),
    leafLevel.deepInputProperty("findings.0.value.name", ""),
]);

exports.immunizationsSectionEntriesOptionalHtmlHeader = getText('immunizations', sectionHeaders.immunizationsHeaders, [
    leafLevel.deepInputProperty("product.unencoded_name", ""),
    leafLevel.deepInputProperty("product.manufacturer", ""),
    leafLevel.deepInputProperty("dose_quantity.value", ""),
    leafLevel.deepInputProperty("administration.route.name", ""),
    leafLevel.deepInputProperty("approach_site.code", ""),
    leafLevel.deepInputProperty("administration.route.name", ""),
    extracted_date_time(),
    leafLevel.deepInputProperty("description", ""),
]);

exports.payersSectionHtmlHeader = getText('immunizations', sectionHeaders.payersHeaders, [
    leafLevel.deepInputProperty("policy.insurance.performer.organization.0.name.0", ""),
    leafLevel.deepInputProperty("policy.identifiers.0.extension", ""),
    leafLevel.deepInputProperty("participant.performer.identifiers.0.extension", ""),
    leafLevel.deepInputProperty("participant.date_time.low.date", ""),
    leafLevel.deepInputProperty("participant.date_time.high.date", ""),
]);

exports.planOfCareSectionHtmlHeader = {
    key: "text",
    existsWhen: condition.keyExists("plan_of_care"),
    content: [{
        key: "table",
        content: [{
            key: "thead",
            content: [{
                key: "tr",
                content: {
                    key: "th",
                    attributes: {
                        colspan: "4"
                    },
                    text: "Plan of Care"
                }
            }, {
                key: "tr",
                content: [{
                    key: "th",
                    text: leafLevel.input,
                    dataTransform: function () {
                        return sectionHeaders.planOfCareHeaders;
                    }
                }]
            }]
        }, {
            key: "tbody",
            content: [{
                key: "tr",
                content: [{
                    key: "td",
                    text: leafLevel.deepInputProperty("plan.name", nda)
                }, {
                    key: "td",
                    text: leafLevel.deepInputDate("date_time.low", nda)
                }, {
                    key: "td",
                    text: leafLevel.deepInputProperty("severity.name", nda)
                }, {
                    key: "td",
                    content: {

                        key: "table",
                        content: [{
                            key: "thead",
                            content: [{
                                key: "tr",
                                content: [{
                                    key: "th",
                                    text: leafLevel.input,
                                    dataTransform: function () {
                                        return ['Goals', ''];
                                    }
                                }]
                            }]
                        }, {
                            key: "tbody",
                            content: [{
                                key: "tr",
                                content: [{
                                    key: "td",
                                    text: leafLevel.deepInputProperty("goal.name", nda)
                                }, {
                                    key: "td",
                                    content: {

                                        key: "table",
                                        content: [{
                                            key: "thead",
                                            content: [{
                                                key: "tr",
                                                content: [{
                                                    key: "th",
                                                    text: leafLevel.input,
                                                    dataTransform: function () {
                                                        return ['Interventions'];
                                                    }
                                                }]
                                            }]
                                        }, {
                                            key: "tbody",
                                            content: [{
                                                key: "tr",
                                                content: [{
                                                    key: "td",
                                                    text: leafLevel.deepInputProperty("intervention.name", nda)
                                                }]
                                            }],
                                            dataKey: 'interventions'
                                        }]

                                    }

                                }]
                            }],
                            dataKey: 'goals'
                        }]
                    }

                }]
            }],
            dataKey: 'plan_of_care'
        }]
    }]
};

exports.socialHistorySectionHtmlHeader = {};

exports.vitalSignsSectionEntriesOptionalHtmlHeader = {};

function extracted_date_time() {
    return function (input) {
        let value = bbu.object.deepValue(input, "date_time.point");
        if (value) {
            value = bbu.datetime.modelToDate({
                date: value.date,
                precision: value.precision // workaround a bug in bbud.  Changes precision.
            });
            if (value) {
                const vps = value.split('-');
                if (vps.length === 3) {
                    return [vps[1], vps[2], vps[0]].join('/');
                }
            }
        }
        return nda;
    };
}

const notAvailable = "Not Available";
exports.allergiesSectionEntriesRequiredHtmlHeaderNA = notAvailable;
exports.medicationsSectionEntriesRequiredHtmlHeaderNA = notAvailable;
exports.problemsSectionEntriesRequiredHtmlHeaderNA = notAvailable;
exports.proceduresSectionEntriesRequiredHtmlHeaderNA = notAvailable;
exports.resultsSectionEntriesRequiredHtmlHeaderNA = notAvailable;
exports.encountersSectionEntriesOptionalHtmlHeaderNA = notAvailable;
exports.immunizationsSectionEntriesOptionalHtmlHeaderNA = notAvailable;
exports.payersSectionHtmlHeaderNA = notAvailable;
exports.planOfCareSectionHtmlHeaderNA = notAvailable;
exports.socialHistorySectionHtmlHeaderNA = notAvailable;
exports.vitalSignsSectionEntriesOptionalHtmlHeaderNA = notAvailable;

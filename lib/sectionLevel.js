"use strict";

const sectionHeaders = require('./sectionTextHeaders');
const bbu = require("blue-button-util");

const fieldLevel = require("./fieldLevel");
const entryLevel = require("./entryLevel");
const leafLevel = require('./leafLevel');
const contentModifier = require("./contentModifier");

const required = contentModifier.required;
const bbud = bbu.datetime;
const bbuo = bbu.object;

const nda = "No Data Available";

const condition = require('./condition');

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

const allergiesTextRow = [
    leafLevel.deepInputProperty("observation.allergen.name", ""),
    leafLevel.deepInputProperty("observation.severity.code.name", ""),
    leafLevel.deepInputProperty("observation.reactions.0.reaction.name", ""),
    leafLevel.deepInputProperty("observation.reactions.0.severity.code.name", ""),
    leafLevel.deepInputProperty("observation.status.name", "")
];

exports.allergiesSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.6"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.6.1"),
            fieldLevel.templateCode("AllergiesSection"),
            fieldLevel.templateTitle("AllergiesSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("allergies")

            },
            getText('allergies', sectionHeaders.allergiesTextHeaders, allergiesTextRow), {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.allergyProblemAct, required]
                ],
                dataKey: "allergies",
                required: true
            }
        ]
    }]
};

const medicationsTextRow = [ // Name, did not find class in the medication blue-button-data
    function (input) {
        let value = bbuo.deepValue(input, 'product.product.name');
        if (!bbuo.exists(value)) {
            value = bbuo.deepValue(input, 'product.unencoded_name');
        }
        if (!bbuo.exists(value)) {
            return "";
        } else {
            return value;
        }
    },
    leafLevel.deepInputProperty("supply.repeatNumber", ""),
    leafLevel.deepInputDate("supply.date_time.point", "")
];

exports.medicationsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.1"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.1.1"),
            fieldLevel.templateCode("MedicationsSection"),
            fieldLevel.templateTitle("MedicationsSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("medications")

            },
            getText('medications', sectionHeaders.medicationsTextHeaders, medicationsTextRow), {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.medicationActivity, required]
                ],
                dataKey: "medications",
                required: true
            }
        ]
    }]
};

exports.problemsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.5"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.5.1"),
            fieldLevel.templateCode("ProblemSection"),
            fieldLevel.templateTitle("ProblemSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("problems")

            }, {
                key: "text",
                existsWhen: condition.keyExists("problems"),

                content: [{
                    key: "table",
                    content: [{
                        key: "thead",
                        content: [{
                            key: "tr",
                            content: {
                                key: "th",
                                attributes: {
                                    colspan: "2"
                                },
                                text: "Problems"
                            }
                        }, {
                            key: "tr",
                            content: [{
                                key: "th",
                                text: leafLevel.input,
                                dataTransform: function () {
                                    return sectionHeaders.problemsTextHeaders;
                                }
                            }]
                        }]
                    }, {
                        key: "tbody",
                        content: [{
                            key: "tr",
                            content: [{
                                key: "td",
                                text: leafLevel.deepInputProperty("problem.code.name", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("problem.severity.code.name", nda)
                            }]
                        }],
                        dataKey: 'problems'
                    }]
                }]
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.problemConcernAct, required]
                ],
                dataKey: "problems",
                required: true
            }
        ]
    }]
};

exports.proceduresSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.7"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.7.1"),
            fieldLevel.templateCode("ProceduresSection"),
            fieldLevel.templateTitle("ProceduresSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("procedures")

            }, {
                key: "text",
                existsWhen: condition.keyExists("procedures"),

                content: [{
                    key: "table",
                    content: [{
                        key: "thead",
                        content: [{
                            key: "tr",
                            content: {
                                key: "th",
                                attributes: {
                                    colspan: "5"
                                },
                                text: "Procedures"
                            }
                        }, {
                            key: "tr",
                            content: [{
                                key: "th",
                                text: leafLevel.input,
                                dataTransform: function () {
                                    return sectionHeaders.proceduresHeaders;
                                }
                            }]
                        }]
                    }, {
                        key: "tbody",
                        content: [{
                            key: "tr",
                            content: [{
                                key: "td",
                                text: leafLevel.deepInputProperty("procedure.name", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("procedure.code", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputDate("date_time.point", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("performer.0.organization.0.name.0", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("performer.0.organization.0.phone.0.value.number", nda)
                            }]
                        }],
                        dataKey: 'procedures'
                    }]
                }]
            }, {
                key: "entry",
                attributes: {
                    "typeCode": function (input) {
                        return input.procedure_type === "procedure" ? "DRIV" : null;
                    }
                },
                content: [
                    entryLevel.procedureActivityAct,
                    entryLevel.procedureActivityProcedure,
                    entryLevel.procedureActivityObservation
                ],
                dataKey: "procedures"
            }
        ]
    }],
    notImplemented: [
        "entry required"
    ]
};

exports.resultsSectionEntriesRequired = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.3"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.3.1"),
            fieldLevel.templateCode("ResultsSection"),
            fieldLevel.templateTitle("ResultsSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("results")

            }, {
                key: "text",
                existsWhen: condition.keyExists("results"),

                content: [{
                    key: "table",
                    content: [{
                        key: "thead",
                        content: [{
                            key: "tr",
                            content: {
                                key: "th",
                                attributes: {
                                    colspan: "7"
                                },
                                text: "Laboratory Results"
                            }
                        }, {
                            key: "tr",
                            content: [{
                                key: "th",
                                text: leafLevel.input,
                                dataTransform: function () {
                                    return ['Test', 'Result', 'Units', 'Ref low', 'Ref high', 'Date', 'Source'];
                                }
                            }]
                        }]
                    }, {
                        key: "tbody",
                        content: [{
                            key: "tr",
                            content: [{
                                key: "td",
                                attributes: {
                                    colspan: "7"
                                },
                                text: leafLevel.deepInputProperty('result_set.name', nda),
                            }]
                        }, {
                            key: "tr",
                            content: [{
                                key: "td",
                                text: leafLevel.deepInputProperty("result.name", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("value", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("unit", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("reference_range.low", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("reference_range.high", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputDate("date_time.point", nda),
                            }, {
                                key: "td",
                                text: nda
                            }],
                            dataKey: 'results'
                        }],
                        dataKey: 'results'
                    }]
                }]
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    [entryLevel.resultOrganizer, required]
                ],
                dataKey: "results",
                required: true
            }
        ]
    }]
};

exports.encountersSectionEntriesOptional = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.22"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.22.1"),
            fieldLevel.templateCode("EncountersSection"),
            fieldLevel.templateTitle("EncountersSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("encounters")

            }, {
                key: "text",
                existsWhen: condition.keyExists("encounters"),

                content: [{
                    key: "table",
                    content: [{
                        key: "caption",
                        text: "Encounters"
                    }, {
                        key: "thead",
                        content: [{
                            key: "tr",
                            content: [{
                                key: "th",
                                text: leafLevel.input,
                                dataTransform: function () {
                                    return sectionHeaders.encountersHeaders
                                }
                            }]
                        }]
                    }, {
                        key: "tbody",
                        content: [{
                            key: "tr",
                            content: [{
                                key: "td",
                                text: leafLevel.deepInputProperty("encounter.name", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("locations.0.name", nda)
                            }, {
                                key: "td",
                                text: function (input) {
                                    let value = bbuo.deepValue(input, "date_time.point");
                                    if (value) {
                                        value = bbud.modelToDate({
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
                                }
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("findings.0.value.name", nda)
                            }],
                        }],
                        dataKey: 'encounters'
                    }]
                }]
            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.encounterActivities, required]
                ],
                dataKey: "encounters"
            }
        ]
    }]
};

exports.immunizationsSectionEntriesOptional = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.2"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.2.1"),
            fieldLevel.templateCode("ImmunizationsSection"),
            fieldLevel.templateTitle("ImmunizationsSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("immunizations")

            }, {
                key: "entry",
                attributes: {
                    "typeCode": "DRIV"
                },
                content: [
                    [entryLevel.immunizationActivity, required]
                ],
                dataKey: "immunizations"
            }
        ]
    }]
};

exports.payersSection = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.18"),
            fieldLevel.templateCode("PayersSection"),
            fieldLevel.templateTitle("PayersSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("payers")

            }, {
                key: "text",
                existsWhen: condition.keyExists("payers"),

                content: [{
                    key: "table",
                    content: [{
                        key: "thead",
                        content: [{
                            key: "tr",
                            content: {
                                key: "th",
                                attributes: {
                                    colspan: "5"
                                },
                                text: "Payers"
                            }
                        }, {
                            key: "tr",
                            content: [{
                                key: "th",
                                text: leafLevel.input,
                                dataTransform: function () {
                                    return sectionHeaders.payersHeaders
                                }
                            }]
                        }]
                    }, {
                        key: "tbody",
                        content: [{
                            key: "tr",
                            content: [{
                                key: "td",
                                text: leafLevel.deepInputProperty("policy.insurance.performer.organization.0.name.0", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("policy.identifiers.0.extension", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("participant.performer.identifiers.0.extension", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("participant.date_time.low.date", nda)
                            }, {
                                key: "td",
                                text: leafLevel.deepInputProperty("participant.date_time.high.date", nda)
                            }]
                        }],
                        dataKey: 'payers'
                    }]
                }]
            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    [entryLevel.coverageActivity, required]
                ],
                dataKey: "payers"
            }
        ]
    }]
};

exports.planOfCareSection = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.10"),
            fieldLevel.templateCode("PlanOfCareSection"),
            fieldLevel.templateTitle("PlanOfCareSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("plan_of_care")

            }, {
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
                                    return ['Program', 'Start Date', 'Severity', ''];
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
            }, {
                key: "entry",
                attributes: {
                    "typeCode": function (input) {
                        return input.type === "observation" ? "DRIV" : null;
                    }
                },
                content: [
                    entryLevel.planOfCareActivityAct,
                    entryLevel.planOfCareActivityObservation,
                    entryLevel.planOfCareActivityProcedure,
                    entryLevel.planOfCareActivityEncounter,
                    entryLevel.planOfCareActivitySubstanceAdministration,
                    entryLevel.planOfCareActivitySupply,
                    entryLevel.planOfCareActivityInstructions
                ],
                dataKey: "plan_of_care"
            }
        ]
    }]
};

exports.socialHistorySection = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.17"),
            fieldLevel.templateCode("SocialHistorySection"),
            fieldLevel.templateTitle("SocialHistorySection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("social_history")

            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    entryLevel.smokingStatusObservation,
                    entryLevel.socialHistoryObservation
                ],
                dataKey: "social_history"
            }
        ]
    }],
    notImplemented: [
        "pregnancyObservation",
        "tobaccoUse"
    ]
};

exports.vitalSignsSectionEntriesOptional = {
    key: "component",
    content: [{
        key: "section",
        content: [
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.4"),
            fieldLevel.templateId("2.16.840.1.113883.10.20.22.2.4.1"),
            fieldLevel.templateCode("VitalSignsSection"),
            fieldLevel.templateTitle("VitalSignsSection"), {
                key: "text",
                text: "Not Applicable",
                existsWhen: condition.keyDoesntExist("vitals")

            }, {
                key: "entry",
                attributes: {
                    typeCode: "DRIV"
                },
                content: [
                    [entryLevel.vitalSignsOrganizer, required]
                ],
                dataKey: "vitals"
            }
        ]
    }]
};

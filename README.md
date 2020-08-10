blue-button-generate
====================
This is a forked version from [OpenEMR Blue Button CCDA Generator](https://github.com/openemr/oe-blue-button-generate)

npm i cs-blue-button-generate

blue-button-generate is a module to generate CCDA files from JSON data.  Currently, it only supports [blue-button](https://github.com/amida-tech/blue-button) JSON data model.

## Usage

``` javascript
const json = {...};
const xml = BlueButtonGenerate.generateCCD(json, {
    preventNullFlavor: false
});
```

## Implementation

blue-button-generate uses javascript template objects for implementation.  Each template in CCDA is represented with an object. As an example, Reaction Observation object is shown
``` javascript
var reactionObservation = exports.reactionObservation = {
    key: "observation",
    attributes: {
        "classCode": "OBS",
        "moodCode": "EVN"
    },
    content: [
        fieldLevel.templateId("2.16.840.1.113883.10.20.22.4.9"),
        fieldLevel.id,
        fieldLevel.nullFlavor("code"),
        fieldLevel.text(leafLevel.sameReference("reaction")),
        fieldLevel.statusCodeCompleted,
        fieldLevel.effectiveTime, {
            key: "value",
            attributes: [
                leafLevel.typeCD,
                leafLevel.code
            ],
            dataKey: 'reaction',
            existsWhen: condition.codeOrDisplayname,
            required: true
        }, {
            key: "entryRelationship",
            attributes: {
                "typeCode": "SUBJ",
                "inversionInd": "true"
            },
            content: severityObservation,
            existsWhen: condition.keyExists('severity')
        }
    ]
};
```

This template is internally used with a call
```  javascript
js2xml.update(xmlDoc, input, context, reactionObservation);
```
where `xmlDoc` is the parent xml document (Allergy Intolerance Observation) and `input` is the immediate parent of [bluebutton.js](https://github.com/blue-button/bluebutton.js) object that describes Reaction Observation.  `context` is internally used for indices in text references.

### Template Structure

The following are the properties of the templates
* `key`: This is the name for the xml element.
* `attributes`: This describes the attributes of the element.  `attributes` can be an object of with `key` and `value` pairs for each attribute or it can be an array of such objects.  Each attribute object or can be a function with `input` argument that returns attributes.
* `text`: This is a function with `input` attribute that returns text value of the element.
* `content`: This is an array of other templates that describe the children of the element.  For a single child an object can be used.
* `dataKey`: This is the property of `input` that serves as the data for the template.
* `required`: This identifies if template is required or not.  If template is required and there is not value in the `input` a `nullFlavor` node is created.
* `dataTransform`: This is a function to transform the input.
* `existWhen`: This is a boolean function with `input` argument to describe if the elements should exist or not.

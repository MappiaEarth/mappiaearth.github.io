function stripAllEmptyCharacters(string) {
    var trimLeft = /(^\s+)/;
    var trimRight = /(\s+$)/;
    string = string.replace(trimLeft, "");
    string = string.replace(trimRight, "");
    return string;
}

/**
 * Gets params description from DOM object
 *
 * @param {DOM} propertyDOM HTML DOM object
 * @returns {Object} Object with param name as key and description as value
 *
 */
function getParamsDescription(propertyDOM) {
    var regex = new RegExp('@param[ ]+([^ ]+)[ ]+([^@]+)', 'g');

    var propertyContent = propertyDOM.innerText;

    var paramsDescription = {};
    var matches;
    while ((matches = regex.exec(propertyContent)) !== null) {
        if (matches.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        var descStripped = stripAllEmptyCharacters(matches[2]);
        paramsDescription[matches[1]] = descStripped;
    }

    return paramsDescription;
}

/**
 * Return the string escaping all regex symbols
 *
 * @param {String} literal_string string to be escaped
 * @returns escaped string
 */
function regExpEscape(literal_string) {
    return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

/**
 * Creates tooltips and spans for text decorations in property's
 *
 * @param {DOM} propertyDOM HTML DOM object
 *
 */
function interpretProperty(propertyDOM) {
    var curParamsDescription = getParamsDescription(propertyDOM);

    /* create tooltip on function params */
    var funcSignature = propertyDOM.querySelector('.property__title');
    var funcSigContent = funcSignature.innerHTML;
    var matches = funcSigContent.match(/function *\(([^\)]*)\)/);
    if(matches !== null){
        var strippedMatch = matches[1].replace(/ /g,'');
        var foundParams = strippedMatch.split(',');
        for(var iParam = 0; iParam < foundParams.length; iParam++){
            var description = curParamsDescription[foundParams[iParam]];
            if (description) {

                description = description.replace(new RegExp('^[ ]*\{([^}]+)\}[ ]*'), '<h4 className="property_type">$1</h4>');
                
                funcSigContent = funcSigContent.replace(foundParams[iParam], "<span class=\"property_param\" >" + foundParams[iParam] + "<div class=\"property_tooltip\"><pre class=\"tooltip_content\">" + description + "</pre></div></span>");
            }
        }
    }
    funcSignature.innerHTML= funcSigContent;

    var elementContent = propertyDOM.innerHTML;

    /* underline param names  */
    elementContent = elementContent.replace(new RegExp('(@param)[ ]+([^ ]+)[ ]+', 'g'), '$1 <span class="property_param">$2</span> ');
    /* color variable types */
    elementContent = elementContent.replace(new RegExp('\{([^ ]*?)\}', 'g'),
        '<span class="property_type">$1</span>');
    propertyDOM.innerHTML = elementContent;
}

/** Add example and default value to the tooltip of the property passed as parameter
 *
 * @param {DOM} propertyDOM property to create tooltip
 */
function addExpandedPropTooltip(propertyDOM) {
    var examples = propertyDOM.getElementsByClassName("property__expanded");

    if (examples.length != 0 && examples[0].innerHTML != "") {
        var propertyTooltip = document.createElement("span");
        propertyTooltip.className = "property_tooltip";
        propertyTooltip.innerText = examples[0].innerText;
        var propertyKey = propertyDOM.getElementsByClassName("property-key")[0];
        propertyKey.appendChild(propertyTooltip);
    }
}

/* Add all tooltips and format text */
var properties = document.getElementsByClassName("property");
for (var iProp = 0; iProp < properties.length; iProp++) {
    interpretProperty(properties[iProp]);
    addExpandedPropTooltip(properties[iProp]);
}

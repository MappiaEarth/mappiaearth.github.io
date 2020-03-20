function getParamsDescription(propertyDOM) {
    var regex = new RegExp('@param[ ]+([^ ]+)[ ]+([^\r\n]+)', 'g');

    var propertyContent = getPropertyElement(propertyDOM).innerText;

    var paramsDescription = {};
    var matches;
    while ((matches = regex.exec(propertyContent)) !== null) {
        if (matches.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        paramsDescription[matches[1]] = matches[2];
    }
    return paramsDescription;
}

function interpretProperty(propertyDOM) {
    var curParamsDescription = getParamsDescription(propertyDOM);
    var paramRegex = new RegExp('\{\{([^ ]*?)\}\}', 'g');
    var paramMatches;
    var elementContent = propertyDOM.innerHTML;
    var replaces = [];
    while ((paramMatches = paramRegex.exec(elementContent)) !== null) {
        if (paramMatches.index === paramRegex.lastIndex) {
            paramRegex.lastIndex++;
        }
        if (curParamsDescription[paramMatches[1]])
            replaces.push({
                from: paramMatches.index,
                to: paramMatches.index + paramMatches[0].length,
                replace: "<span class=\"property_param\" >" + paramMatches[1]
                    + "<span class=\"property_tooltip\">"
                    + curParamsDescription[paramMatches[1]] + "</span></span>"
            });
    }

    while (replaces.length) {
        var curReplace = replaces.pop();
        elementContent = elementContent.slice(0, curReplace.from)
            + curReplace.replace + elementContent.slice(curReplace.to, curReplace.length);
    }

    elementContent = elementContent.replace(new RegExp('(@param)[ ]+([^ ]+)[ ]+', 'g'), '$1 <span class="property_param">$2</span> ');
    elementContent = elementContent.replace(new RegExp('\{([^ ]*?)\}', 'g'),
        '<span class="property_type">$1</span>');
    propertyDOM.innerHTML = elementContent;
}

function getPropertyElement(elementDOM){
    var propertyElement = {};
    var properties = document.getElementsByClassName('property');
    for (var iProp = 0; iProp < properties.length; iProp++) {
        if (properties[iProp].contains(elementDOM))
            propertyElement = properties[iProp];
    }
    return propertyElement;
}

function addExampleTooltip(propertyDOM) {
    var examples = propertyDOM.getElementsByClassName("property__example");
    if (examples.length > 0) {
        var propertyTooltip = document.createElement("span");
        propertyTooltip.className = "property_tooltip";
        propertyTooltip.innerText = examples[0].innerText;
        var propertyKey = propertyDOM.getElementsByClassName("property-key")[0];
        propertyKey.appendChild(propertyTooltip);
    }
}

var properties = document.getElementsByClassName("property");
for (var iProp = 0; iProp < properties.length; iProp++) {
    interpretProperty(properties[iProp]);
    addExampleTooltip(properties[iProp]);
}

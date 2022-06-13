'use-strict';

//clears all fields in parameters object
function clearFields(fieldsObject) {
    for(var key in fieldsObject)
        fieldsObject[key].value = "";
}

//fills fields by data object
//mathes keys and fills the field by the value
function fillFields(fieldsObject, data) {
    for(var key in fieldsObject)
        fieldsObject[key].value = data[key];
}

//fills labels by data object
//mathes keys and fills the field by the value
function fillLabels(labelsObject, data) {
    for(var key in labelsObject)
        labelsObject[key].innerText = data[key]; //innerText used instead of innerhtml to prevent js injection (XSS Attack)
}

//Finds first child element with className
function findFirstChild(domElem, className) {
    var children = domElem.childNodes;
    for (var i=0; i < children.length; i++) {
        //Regex for class name so it may find class name with spaces or start/end of text
        var classReg = new RegExp('(\s|^)' + className + '(\s|$)');
        if (children[i].className && classReg.test(children[i].className)) {
            return children[i];
        }
    }
}
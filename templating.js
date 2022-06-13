'use-strict';

/*====================
======templating======
======================*/

/*=======templates string by replacing {{key}} with object values====*/
function templateItem(obj, template) {
    var temp = template;
    for(var key in obj) {
        temp = temp.replaceAll("{{" + key + "}}", obj[key]);
    }
    return temp;
}

/*takes an array and templates each time object
  then returns a string with all the elements templated*/
function templateItems(data, template) {
    var temp = "";
    for(var i = 0; i < data.length; i++) {
        var result = templateItem(data[i], template);
        result = result.replaceAll("{{index}}", i);
        temp += result;
    }
    return temp;
}
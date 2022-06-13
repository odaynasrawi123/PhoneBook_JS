'use-strict';

/*========*/
//Contact item template {{*}} gets replaced with values and then we turn it to html
const contactItemTemplate = "<!--=============item============-->" +
                            "<div id=\"contact{{id}}\" onclick=\"viewContactInfo({{id}});\" class=\"list_item\">" +
                                "<p>{{name}}</p>" +
                                "<p>{{telephone}}</p>" +
                                "<p class=\"fill\">" +
                                "<button onclick=\"editContact({{id}});event.stopPropagation();event.preventDefault();\" class=\"btn\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i></button>" +
                                "<button onclick=\"removeContact({{id}});event.stopPropagation();event.preventDefault();\" class=\"btn\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></button>" +
                                "</p>" +
                            "</div>" +
                            "<!--=============================-->";
/*========*/

//Clear validation: takes one parament (and object with elements values)
function clearValidation(fieldsObject) {
    for(var key in fieldsObject) {
        fieldsObject[key].className = fieldsObject[key].className.replace("invalid").trim();
        let validationMessage = findFirstChild(fieldsObject[key].parentNode, "validation-message");
        if(validationMessage) validationMessage.innerHTML = "";
    }
}

/*==========================================
  ===============Elements===================
  ==========================================*/

//===============Used elements===============
const contactsListView = document.getElementById('contactsListView');
const createNewContactPopup = document.getElementById('createNewContactPopup');
const editContactPopup = document.getElementById('editContactPopup');
const viewContactPopup = document.getElementById('viewContactPopup');
const searchField = document.getElementById('searchField');
const listEmptyAlert = document.getElementById('list_empty');
const dataSavedAlert = document.getElementById('data_saved_alert');
//===========================================

//===create popup object with all elements inside===
const createPopup = {
    name: document.getElementById('createNameField'),
    telephone: document.getElementById('createTelephoneField'),
    address: document.getElementById('createAddressField'),
    email: document.getElementById('createEmailField'),
    description: document.getElementById('createDescriptionField')
};

//===edit popup object with all elements inside===
const editPopup = {
    name: document.getElementById('editNameField'),
    telephone: document.getElementById('editTelephoneField'),
    address: document.getElementById('editAddressField'),
    email: document.getElementById('editEmailField'),
    description: document.getElementById('editDescriptionField')
};

//===view popup object with all elements inside===
const viewInfoPopup = {
    name: document.getElementById('nameLabel'),
    telephone: document.getElementById('telephoneLabel'),
    address: document.getElementById('addressLabel'),
    email: document.getElementById('emailLabel'),
    description: document.getElementById('descriptionLabel')
};

/*==========================================
  ==========================================
  ==========================================*/

//Updates contacts list
function updateContactsListView() {
    //gets search text
    var searchTxt = searchField.value;
    var data = [];
    //Adds contacts to data array by search value
    dataManager.contacts.forEach(item => {
        if(item.name.toLowerCase().includes(searchTxt.toLowerCase())) data.push(item);
    });

    //if there is to data show the proper text
    if(data == 0) {
        listEmptyAlert.style.display = "";
        contactsListView.innerHTML = "";
        return;
    }
    
    //if there is data hide empty list text
    listEmptyAlert.style.display = "none";

    //sort array by contact names
    data.sort((a, b) => a.name.localeCompare(b.name));

    //template items by data array
    contactsListView.innerHTML = templateItems(data, contactItemTemplate);
}

function removeContact(id) {
    dataManager.removeContact(id);
    updateContactsListView();
}

/*=================*/
//Validates required fields returns false in case there is an invalid field
function validateContactFieldsView(view) {
    //Clear previus validation
    clearValidation(view);

    let valid = true;

    const nameReg = /^[a-zA-Z\s]{3,15}$/g;
    const phoneReg = /^[0-9]{3}-[0-9]{7}$/g;

    if(view.name.value == "") {
        view.name.className += " invalid";
        let validationMessage = findFirstChild(view.name.parentNode, "validation-message");
        if(validationMessage) validationMessage.innerHTML = "Name is required";
        valid = false;
    } else if(!nameReg.test(view.name.value)) {
        view.name.className += " invalid";
        let validationMessage = findFirstChild(view.name.parentNode, "validation-message");
        if(validationMessage) validationMessage.innerHTML = "Name must be only letters (3 to 15 letters)";
        valid = false;
    }

    if(view.telephone.value == "") {
        view.telephone.className += " invalid";
        let validationMessage = findFirstChild(view.telephone.parentNode, "validation-message");
        if(validationMessage) validationMessage.innerHTML = "Telephone is required";
        valid = false;
    } else if(!phoneReg.test(view.telephone.value)) {
        view.telephone.className += " invalid";
        let validationMessage = findFirstChild(view.telephone.parentNode, "validation-message");
        if(validationMessage) validationMessage.innerHTML = "Please match requested format (000-0000000)";
        valid = false;
    }

    return valid;
}
/*=================*/

/*==========*/
//when edit popup apearse this value is set to the current edit contact id
var edittingContactId;
//show edit popup with field filled with proper data
function editContact(id) {
    //show edit popup
    editContactPopup.style.display = "";
    //fills fields with proper data
    fillFields(editPopup, dataManager.getContact(id));
    //clears fields validation
    clearValidation(editPopup);
    edittingContactId = id;
}

//when editting is done
function updateContactData() {
    //check if fields are valid
    if(!validateContactFieldsView(editPopup)) return;

    //update data
    dataManager.updateContactData(edittingContactId, editPopup.name.value, editPopup.telephone.value,
        editPopup.address.value, editPopup.email.value, editPopup.description.value);

    //set edditing done
    edittingContactId = null;

    //update table
    updateContactsListView();

    //hide edit popup
    editContactPopup.style.display = "none";
}
/*==========*/

//inteval
var myVar;
function saveData() {
    //save contacts data
    dataManager.saveContacts();
    //if there is an interval the clear it
    if(myVar) clearTimeout(myVar);
    //show data saved text
    dataSavedAlert.style.display = "";
    //hide data saved text after 3 seconds
    myVar = setTimeout(function() { 
        dataSavedAlert.style.display = "none";
    }, 3000);
}

function viewContactInfo(id) {
    //fill data
    fillLabels(viewInfoPopup, dataManager.getContact(id));
    //show popup
    viewContactPopup.style.display = "";
}

function addContact() {
    //validate fields
    if(!validateContactFieldsView(createPopup)) return;

    //Create contact object
    var contactData = new Contact(createPopup.name.value, createPopup.telephone.value,
        createPopup.address.value, createPopup.email.value, createPopup.description.value);
    //add contact
    dataManager.addContact(contactData);
    //update table
    updateContactsListView();
    //hide add contact popup
    createNewContactPopup.style.display = "none";
}

function openCreateContactPopup() {
    //clear popup fields
    clearFields(createPopup);
    //clear validation alerts
    clearValidation(createPopup);
    //show popup
    createNewContactPopup.style.display = '';
}

function clearData() {
    dataManager.contacts = [];
    //update table
    updateContactsListView();
}

//handle click out of popup
//(closes popup when click outside)
function overlayClick(event, popup) {
    if(event.target.className.includes("popup_overlay"))
        popup.style.display = "none";
}

function closeCreatePopup() {
    //hide create contact popup
    createNewContactPopup.style.display = "none";
}

function closeEditPopup() {
    //hide edit contact popup
    editContactPopup.style.display = "none";
}

/*========Start up code=========
  ==============================*/
//update table data on startup
updateContactsListView();
/*=========Event Listeners Setup==========*/
//add event listener for search field
searchField.addEventListener("keyup", updateContactsListView);

document.getElementById("createContactBtn").addEventListener("click", openCreateContactPopup);

document.getElementById("clearDataBtn").addEventListener("click", clearData);

document.getElementById("saveDataBtn").addEventListener("click", saveData);

document.getElementById("closeCreatePopupBtn").addEventListener("click", closeCreatePopup);

document.getElementById("closeEditPopupBtn").addEventListener("click", closeEditPopup);

document.getElementById("createContactBtn").addEventListener("click", addContact);

document.getElementById("updateContactDataBtn").addEventListener("click", updateContactData);

//Set overlay click handlers (close popup when clicked outside)
const popupOverlays = document.getElementsByClassName("popup_overlay");
Array.from(popupOverlays).forEach(overLay => {
    overLay.addEventListener("click", event => {
        overlayClick(event, overLay);
    });
});
/*========================================*/
/*==============================
  ==============================*/
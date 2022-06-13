'use-strict';

//constructor for Contact
var Contact = function(name, telephone, address, email, description) {
    var scope = this;

    this.name = name;
    this.telephone = telephone;
    this.address = address;
    this.email = email;
    this.description = description;

    //Gets the current new contact id
    var id = localStorage.getItem('contactsId');
    if(!id) id = 0; //if id is null then set it to 0

    //Sets the current id
    this.id = id;

    //Updates the id to the next contact
    localStorage.setItem('contactsId', ++id);
};

//DataManager instance
var dataManager = new (function() {
    var scope = this;

    this.contacts = [];

    const contactsKey = 'contacts';

    //Adds new contact object to the contacts array
    this.addContact = function(contact) {
        scope.contacts.push(contact);
    }
    
    //Saves the array to the local storage
    this.saveContacts = function() {
        localStorage.setItem(contactsKey, JSON.stringify(scope.contacts));
    }

    //Removes contact by id
    this.removeContact = function(id) {
        var index = scope.contacts.findIndex(contact => {
            return contact.id == id;
        });
        scope.contacts.splice(index, 1);
    };

    //Deletes all contacts
    this.deleteContacts = function() {
        scope.contacts = [];
        localStorage.removeItem(contactsKey);
    };

    //Gets contact object by id
    this.getContact = function(id) {
        return scope.contacts.find(contact => {
            return contact.id == id;
        });
    };

    //Updates contact data by id
    this.updateContactData = function(id, name, telephone, address, email, description) {
        var index = scope.contacts.findIndex(contact => {
            return contact.id == id;
        });
        if(index == -1) return false;
        scope.contacts[index].name = name;
        scope.contacts[index].telephone = telephone;
        scope.contacts[index].address = address;
        scope.contacts[index].email = email;
        scope.contacts[index].description = description;
    };

    //Loads the contacts array from local storage
    this.loadContacts = function() {
        var data = localStorage.getItem(contactsKey);
        data = data ? JSON.parse(data) : [];
        scope.contacts = data;
    }

    //Loads the contacts data at start up
    this.loadContacts();
})();
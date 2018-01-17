const list = document.getElementById('list');
const formName = document.getElementById('formName');
const formUrl = document.getElementById('formUrl');
const addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');

function getUsers() {
    fetch('http://localhost:3000/users')
        .then(function (response) {
            // Trasform server response to get the dogs
            response.json().then(function (users) {
                appendUsersToDOM(users);
            });
        });
};

function postUser() {
    // creat post object
    const postObject = {
        name: formName.value,
        email: formUrl.value
    }
    fetch('http://localhost:3000/users', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        getUsers();
        // Reset Form
        resetForm();
    });
}

// delete dog
function deleteUser(id) {
    // delete dog
    fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
    }).then(function () {
        getUsers();
    });
}

// update dog
function updateUser(id) {
    // creat put object
    const putObject = {
        name: formName.value,
        email: formUrl.value
    }
    // update dog
    fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        getUsers();

        // change button event from update to add
        addButton.disabled = false;

        // remove all event from update button
        clearUpdateButtonEvents();

        // Reset Form
        resetForm();
    });
}

function editUser(user) {
    formName.value = user.name;
    formUrl.value = user.email;
    
    // disable add button
    addButton.disabled = true;

    // clear all events update button events
    clearUpdateButtonEvents();

    // enable and add event on update button
    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updateUser(user.id)
    });

}

function appendUsersToDOM(users) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    // create and append tags
    for (let i = 0; i < users.length; i++) {
        let email= document.createElement('span');
        email.innerText = users[i].email;
        // create name obj
        let name = document.createElement('span');
        name.innerText = users[i].name;

        let editButton = document.createElement('button')
        
        editButton.addEventListener('click', function () {
            editUser(users[i])
        });
        
        editButton.innerText = 'Edit';
        editButton.id = 'editButton';
        let deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', function () {
            deleteUser(users[i].id)
        });
        deleteButton.innerText = 'Delete';
        deleteButton.id = 'deleteButton';
        // create a container for img and name
        let container = document.createElement('div');
        // append elements to container
        container.appendChild(email);
        container.appendChild(name);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        // append container to DOM (list div)
        list.appendChild(container);
    }
}

// reset form
function resetForm() {
    formName.value = '';
    formUrl.value = '';
}
function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}
// add event listener on add button
addButton.addEventListener('click', postUser);

// get dogs
getUsers();
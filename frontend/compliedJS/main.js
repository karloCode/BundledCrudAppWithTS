"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../scss/style.scss");
const fetchApi_1 = __importDefault(require("./fetchApi"));
const getElements_1 = require("./getElements");
const api = new fetchApi_1.default();
const homeUrl = window.location.href;
const root = document.getElementById('root');
(function () {
    api.getAll('https://young-reef-15976.herokuapp.com')
        .then((data) => {
        let contentStore = ``;
        data.map(person => {
            contentStore += `<li class="list-group-item name-list" id="${person._id}"> Name: ${person.name}</li>`;
        });
        root.innerHTML = `<ul class="list-group">${contentStore}</ul>`;
        const nameList = document.querySelectorAll('.name-list');
        getPerson(nameList);
    });
})();
function getPerson(nameList) {
    nameList.forEach(li => {
        li.addEventListener('click', async () => {
            try {
                const data = await api.getOne('https://young-reef-15976.herokuapp.com/getPerson', li.id);
                data.forEach(person => {
                    root.innerHTML = `
                  <ul class="list-group">
                     <li class="list-group-item">Name: ${person.name}</li>
                     <li class="list-group-item">Age: ${person.age}</li>
                     <li class="list-group-item">Gender: ${person.gender}</li>
                  </ul>
                  <br />
                  <button class="btn btn-dark" id="editBtn">Edit</button>
                  <button class="btn btn-danger" id="deleteBtn">Delete</button>
               `;
                    const editBtn = getElements_1.queryButtonElement('editBtn');
                    const deleteBtn = getElements_1.queryButtonElement('deleteBtn');
                    editPerson(editBtn, person);
                    deletePerson(deleteBtn, person._id);
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    });
}
function editPerson(editBtn, person) {
    editBtn.addEventListener('click', () => {
        const { _id, name, age, gender } = person;
        root.innerHTML = `
         <form id="editForm">
            <div id="form-group">
               <label for="name">Name</label>
               <input type="text" class="form-control input-elements" name="name" id="name" value="${name ? name : ''}">
            </div>
            <br />
            <div id="form-group">
               <label for="age">Age</label>
               <input type="number" class="form-control input-elements" name="age" id="age" value="${age ? age : ''}">
            </div>
            <br />
            <div id="form-group">
               <label for=gender">Gender</label>
               <input type="text" class="form-control input-elements" name="gender" id="gender" value="${gender ? gender : ''}">
            </div>
            <br />
            <input type="submit" class="btn btn-success" value="Submit">
            <input class="btn btn-dark" id="cancelEditBtn" value="Cancel">
         </form>
      `;
        const editForm = getElements_1.queryFormElement('editForm');
        const editInputElements = getElements_1.queryInputElements(['name', 'age', 'gender']);
        const formBody = getFormInputs(editInputElements);
        const cancelEditBtn = getElements_1.queryButtonElement('cancelEditBtn');
        submitEditedPerson(editForm, cancelEditBtn, _id, formBody);
    });
}
function submitEditedPerson(editForm, cancelEditBtn, _id, formBody) {
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const data = await api.put('https://young-reef-15976.herokuapp.com/updatePerson', _id, formBody);
            if (data.error) {
                throw new Error(data.error);
            }
            else {
                window.location.href = homeUrl;
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    cancelEditBtn.addEventListener('click', () => {
        window.location.href = homeUrl;
    });
}
//*Add person
(function () {
    const addPersonBtn = document.getElementById('addPersonBtn');
    addPersonBtn.addEventListener('click', () => {
        root.innerHTML = `
         <form id="addForm">
            <div id="errorMsg"></div>
            <div id="form-group">
               <label for="name">Name</label>
               <input type="text" class="form-control input-elements" name="name" id="name">
            </div>
            <br />
            <div id="form-group">
               <label for="age">Age</label>
               <input type="number" class="form-control input-elements" name="age" id="age">
            </div>
            <br />
            <div id="form-group">
               <label for=gender">Gender</label>
               <input type="text" class="form-control input-elements" name="gender" id="gender">
            </div>
            <br />
            <input type="submit" class="btn btn-success" value="Submit">
         </form>
      `;
        const addForm = document.getElementById('addForm');
        const inputElements = getElements_1.queryInputElements(['name', 'age', 'gender']);
        const formBody = getFormInputs(inputElements);
        submitAddForm(addForm, formBody);
    });
})();
function getFormInputs(inputElements) {
    let tempInputStore = {};
    inputElements.forEach(elem => {
        elem.oninput = () => {
            const { name, value } = elem;
            Object.assign(tempInputStore, {
                [name]: value
            });
        };
    });
    return tempInputStore;
}
function submitAddForm(form, formBody) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let errors = [];
        try {
            const data = await api.post('https://young-reef-15976.herokuapp.com/addPerson', formBody);
            if (data.error) {
                errors.push(...data.errors);
                throw new Error(data.error);
            }
            else {
                window.location.href = '/';
            }
        }
        catch (error) {
            console.log({ error: error, errors: errors });
            const errorMsg = getElements_1.queryHTMLElement('errorMsg');
            errors.forEach(err => {
                errorMsg.innerHTML += `
               <div class="alert alert-warning alert-dismissible fade show" role="alert">
                  <strong>Validation Error!!!</strong> ${err}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
               </div>
            `;
            });
        }
    });
}
function deletePerson(deleteBtn, _id) {
    deleteBtn.addEventListener('click', async () => {
        try {
            const data = await api.delete('https://young-reef-15976.herokuapp.com/deletePerson', _id);
            if (data.error) {
                throw new Error(data.error);
            }
            else {
                window.location.href = homeUrl;
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}

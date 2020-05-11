import '../scss/style.scss';
import fetchApi from './fetchApi';
import {
   queryInputElements,
   queryButtonElement, 
   queryFormElement,
   queryHTMLElement
   } from './getElements';

const api = new fetchApi();

const homeUrl: string = window.location.href


const root = document.getElementById('root') ! as HTMLElement;

(function() {
   api.getAll<[{ _id: string, name: string, age: number, gender:string }]>('https://young-reef-15976.herokuapp.com')
      .then((data) => {
         let contentStore: string = ``;
         data.map(person => {
            contentStore += `<li class="list-group-item name-list" id="${person._id}"> Name: ${person.name}</li>`;
         });

         root.innerHTML = `<ul class="list-group">${ contentStore }</ul>`;

         const nameList = document.querySelectorAll('.name-list') ! as NodeListOf<Element>;
         getPerson(nameList);
      })
})();

function getPerson(nameList: NodeListOf<Element>) {
   nameList.forEach(li => {
      li.addEventListener('click', async() => {
         try {
            const data: [{ _id: string, name: string, age: number, gender: string }] = await api.getOne<[{ _id: string,name: string, age: number, gender:string }]>('https://young-reef-15976.herokuapp.com/getPerson', li.id);
            
            data.forEach(person => {
               root.innerHTML = `
                  <ul class="list-group">
                     <li class="list-group-item">Name: ${ person.name }</li>
                     <li class="list-group-item">Age: ${ person.age }</li>
                     <li class="list-group-item">Gender: ${ person.gender }</li>
                  </ul>
                  <br />
                  <button class="btn btn-dark" id="editBtn">Edit</button>
                  <button class="btn btn-danger" id="deleteBtn">Delete</button>
               `;

               const editBtn = queryButtonElement('editBtn');
               const deleteBtn = queryButtonElement('deleteBtn');
               editPerson(editBtn, person);
               deletePerson(deleteBtn, person._id);
            });
         } catch (error) {
            console.log(error)
         }
      })
   })
}

function editPerson(editBtn: HTMLButtonElement ,person: { _id: string, name: string, age: number, gender:string }) {
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

      const editForm = queryFormElement('editForm');
      const editInputElements = queryInputElements(['name', 'age', 'gender']);
      const formBody = getFormInputs(editInputElements);
      const cancelEditBtn = queryButtonElement('cancelEditBtn');

      submitEditedPerson(editForm, cancelEditBtn, _id, formBody);
   })
}

function submitEditedPerson(editForm: HTMLFormElement, cancelEditBtn: HTMLButtonElement, _id: string, formBody: object) {
   editForm.addEventListener('submit', async e => {
      e.preventDefault();
      try {
         const data: { name: string, age: number, gender: string, error: string } = await api.put<{name: string, age: number, gender: string, error: string}>('https://young-reef-15976.herokuapp.com/updatePerson', _id, formBody );
         if(data.error) {
            throw new Error(data.error)
         } else {
            window.location.href = homeUrl;
         }
      } catch (error) {
         console.log(error)
      }
   });

   cancelEditBtn.addEventListener('click', () => {
      window.location.href = homeUrl;
   })
}


//*Add person
(function() {
   const addPersonBtn = document.getElementById('addPersonBtn') ! as HTMLAnchorElement;

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

      const addForm = document.getElementById('addForm') ! as HTMLFormElement;
      const inputElements = queryInputElements(['name', 'age', 'gender']);

      const formBody: object = getFormInputs(inputElements);
      submitAddForm(addForm, formBody);

   })
})();

function getFormInputs(inputElements: HTMLInputElement[]) : object {
   let tempInputStore: object = {};
   inputElements.forEach(elem => {
      elem.oninput = () => {
         const { name, value } = elem;
         Object.assign(tempInputStore, {
             [name]: value 
         });
      }
   })

   return tempInputStore;
}

function submitAddForm(form: HTMLFormElement, formBody: object) {
   form.addEventListener('submit', async e => {
      e.preventDefault();
      let errors: string[] = []
      try {
         const data: { name: string, age: number, gender: string, error: string, errors: string[]} = await api.post<{name: string, age: number, gender: string, error: string, errors: string[]}>('https://young-reef-15976.herokuapp.com/addPerson', formBody);
         if(data.error) {
            errors.push(...data.errors)
            throw new Error(data.error);
         } else {
            window.location.href = '/';
         }
      } catch (error) {
         console.log({ error: error, errors: errors})
         const errorMsg = queryHTMLElement('errorMsg');
         errors.forEach(err => {
            errorMsg.innerHTML += `
               <div class="alert alert-warning alert-dismissible fade show" role="alert">
                  <strong>Validation Error!!!</strong> ${err}
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
               </div>
            `;
         })

      }
   })
}

function deletePerson(deleteBtn: HTMLButtonElement ,_id: string) {
      deleteBtn.addEventListener('click', async() => {
         try {
            const data: { deleted: boolean, error: string } = await api.delete<{ deleted: boolean, error: string}>('https://young-reef-15976.herokuapp.com/deletePerson', _id);
      
            if(data.error) {
               throw new Error(data.error);
            } else {
               window.location.href = homeUrl;
            }
         } catch (error) {
            console.log(error)
         }
      })
}
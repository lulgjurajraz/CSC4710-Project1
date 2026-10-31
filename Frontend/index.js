


// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAll') 

    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

    const registerAccount = document.querySelector('#register-account');

    registerAccount.addEventListener('submit',function(event) {

        event.preventDefault();
        const username = document.querySelector('#username-input').value;
        const password = document.querySelector('#password-input').value;
        const firstname = document.querySelector('#firstname-input').value;
        const lastname = document.querySelector('#lastname-input').value;
        const age = document.querySelector('#age-input').value;
        const salary = document.querySelector('#salary-input').value;

        fetch('http://localhost:5050/register',{
            headers:{
                'Content-type':'application/json'
            }, method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                age: age,
                salary:salary
            })
        })
        
        .then(response => response.json())
        .then(data=>{
            if(data.success){
                fetch('http://localhost:5050/getAll')
                .then(response => response.json())
                .then(data=> loadHTMLTable(data.data));
            }
        })
        .catch(error =>{
            console.log(error);
        });
});
});





// // // when the addBtn is clicked
// const addBtn = document.querySelector('#add-name-btn');
// addBtn.onclick = function (){
//     const nameInput = document.querySelector('#name-input');
//     const name = nameInput.value;
//     nameInput.value = "";

//     fetch('http://localhost:5050/insert', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({name: name})
//     })
//     .then(response => response.json())
//     .then(data => insertRowIntoTable(data['data']));
// }

// // sample code when the searchBtn is clicked
// const searchBtn =  document.querySelector('#search-btn');
// searchBtn.onclick = function (){
//     const searchInput = document.querySelector('#search-input');
//     const searchValue = searchInput.value;
//     searchInput.value = "";

//     fetch('http://localhost:5050/search/' + searchValue)
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
// }

//this is me messing around with ID search
const searchID =  document.querySelector('#search-btn-id');
searchID.onclick = function (){
    const searchInput = document.querySelector('#search-input-id');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/searchById/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


//search by age
const searchAge =  document.querySelector('#search-btn-age');
searchAge.onclick = function (){
    const searchInput1 = document.querySelector('#search-input-age1');
    const searchInput2 = document.querySelector('#search-input-age2');
    const age1 = searchInput1.value;
    const age2 = searchInput2.value;
    searchInput1.value = "";
    searchInput2.value = "";

    fetch('http://localhost:5050/searchByAge/' + age1 + '/' + age2)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

//registered after id
const regAfterBtn = document.querySelector('#btn-reg-after-ID');
regAfterBtn.onclick = function (){
    const searchInput = document.querySelector('#input-reg-after-ID');
    const id = searchInput.value;
    searchInput.value = "";
    fetch('http://localhost:5050/regAfter/' + id)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

//registered same day as id
const regSameDayBtn = document.querySelector('#btn-reg-same-day-ID');
regSameDayBtn.onclick = function (){
    const searchInput = document.querySelector('#input-reg-same-day-ID');
    const id = searchInput.value;
    searchInput.value = "";
    fetch('http://localhost:5050/regSameDay/' + id)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

//registered today
const regTodayBtn = document.querySelector('#btn-reg-today');
regTodayBtn.onclick = function (){
    fetch('http://localhost:5050/regToday/')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

let rowToDelete; 

// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
// document.querySelector('table tbody').addEventListener('click', 
//       function(event){
//         if(event.target.className === "delete-row-btn"){

//             deleteRowById(event.target.dataset.id);   
//             rowToDelete = event.target.parentNode.parentNode.rowIndex;    
//             debug("delete which one:");
//             debug(rowToDelete);
//         }   
//         if(event.target.className === "edit-row-btn"){
//             showEditRowInterface(event.target.dataset.id); // display the edit row interface
//         }
//       }
// );

// function deleteRowById(id){
//     // debug(id);
//     fetch('http://localhost:5050/delete/' + id,
//        { 
//         method: 'DELETE'
//        }
//     )
//     .then(response => response.json())
//     .then(
//          data => {
//              if(data.success){
//                 document.getElementById("table").deleteRow(rowToDelete);
//                 // location.reload();
//              }
//          }
//     );
// }

// let idToUpdate = 0;

// function showEditRowInterface(id){
//     debug("id clicked: ");
//     debug(id);
//     document.querySelector('#update-name-input').value = ""; // clear this field
//     const updateSetction = document.querySelector("#update-row");  
//     updateSetction.hidden = false;
//     // we assign the id to the update button as its id attribute value
//     idToUpdate = id;
//     debug("id set!");
//     debug(idToUpdate+"");
// }


// when the update button on the update interface is clicked
// const updateBtn = document.querySelector('#update-row-btn');

// updateBtn.onclick = function(){
//     debug("update clicked");
//     debug("got the id: ");
//     debug(updateBtn.value);
    
//     const updatedNameInput = document.querySelector('#update-name-input');

//     fetch('http://localhost:5050/update',
//           {
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             method: 'PATCH',
//             body: JSON.stringify(
//                   {
//                     id: idToUpdate,
//                     name: updatedNameInput.value
//                   }
//             )
//           }
//     ) 
//     .then(response => response.json())
//     .then(data => {
//         if(data.success){
//             location.reload();
//         }
//         else 
//            debug("no update occurs");
//     })
// }


// this function is used for debugging only, and should be deleted afterwards
// function debug(data)
// {
//     fetch('http://localhost:5050/debug', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({debug: data})
//     })
// }

// function insertRowIntoTable(data){

//    debug("index.js: insertRowIntoTable called: ");
//    debug(data);

//    const table = document.querySelector('table tbody');
//    debug(table);

//    const isTableData = table.querySelector('.no-data');

//   // debug(isTableData);

//    let tableHtml = "<tr>";
   
//    for(var key in data){ // iterating over the each property key of an object data
//       if(data.hasOwnProperty(key)){   // key is a direct property for data
//             if(key === 'dateAdded'){  // the property is 'dataAdded'
//                 data[key] = new Date(data[key]).toLocaleString(); // format to javascript string
//             }
//             tableHtml += `<td>${data[key]}</td>`;
//       }
//    }

//    tableHtml +=`<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
//    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

//    tableHtml += "</tr>";

//     if(isTableData){
//        debug("case 1");
//        table.innerHTML = tableHtml;
//     }
//     else {
//         debug("case 2");
//         // debug(tableHtml);

//         const newrow = table.insertRow();
//         newrow.innerHTML = tableHtml;
//     }
// }

function loadHTMLTable(data){
    debug("index.js: loadHTMLTable called.");

    const table = document.querySelector('table tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
  
    

   let tableHtml = "";

    data.forEach(function ({username, firstname, lastname,age,salary,registerday,signintime}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${username}</td>`;
         tableHtml +=`<td>${firstname}</td>`;
         tableHtml +=`<td>${lastname}</td>`;
         tableHtml +=`<td>${age}</td>`;
         tableHtml +=`<td>${salary}</td>`;
         tableHtml +=`<td>${registerday}</td>`;
         tableHtml +=`<td>${signintime}</td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

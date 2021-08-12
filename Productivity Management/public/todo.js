//variables for my shopping list 
let input = document.getElementById("todoInputTasks");
let button = document.getElementById("taskAddButton");
let list = document.getElementById("todo");

function addTask2Storage(item, callback){
  chrome.storage.local.get({'taskList':[]}, (data)=>{
      data.taskList.push(item);
      chrome.storage.local.set(data, callback);
  });
}

function rmToDo1(id, callback){
  chrome.storage.local.get({'taskList':[]}, (data)=>{
      for(let i = 0; i < data.taskList.length; i++){
          if(data.taskList[i].id == id){
              data.taskList.splice(i, 1);
              break;
          }
      }
      chrome.storage.local.set(data, callback);
  });
}

function fetchAllTasks(callback){
  chrome.storage.local.get({'taskList':[]}, (data) => {
      callback(data.taskList);
  });
}

function updateList(){
  fetchAllTasks((all) => {
    let items = [];
    for(let i = 0; i < all.length; i++){
      items.push(
        `<li class="todo-item" data-key = ${all[i].id}>
            <span>${all[i].text}</span>
            <i class="fas fa-quidditch"></i>
            <span data-url="${all[i]}"  class="delete-todo material-icons-outlined">check_circle</span>
          </li>`
        );
    }
    document.querySelector('#todo').innerHTML = items.join('');
  });
}

function addTask(){
  let text = input.value.trim();
  const item = {
    text,
    checked: true,
    id: Date.now(),
  }
  addTask2Storage(item, ()=>{
    console.log("Item added", item);
    input.value = '';
    updateList();
  });
}

//this will add a new list item after click 
function addListAfterClick() {
  if (input.value.trim().length > 0) {
    addTask();
  }
}

function addListeners(){
  //this will check for the event/keypress and create new list item
  //input.addEventListener("keypress", addListKeyPress);

  //this will check for a click event and create new list item
  button.addEventListener("click", addListAfterClick);

  //list listener 
  list.addEventListener("click", function(e) {
    console.log(e.target, e.target.parentElement);
    let target = e.target;
    if (target.classList.contains("delete-todo")) {
      let id = target.parentElement.getAttribute('data-key');
      rmToDo1(id, ()=>{
        updateList();
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{ 
  addListeners();
  updateList();
});

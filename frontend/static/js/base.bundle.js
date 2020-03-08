(function () {
    'use strict';

    //to know whether editing item or creating new one
    var activeItem = null;

    //django-rest token
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');


    function form() {

        var form = document.getElementById('form-wrapper');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form Submitted');
            //
            //Create Task
            var url = 'http://127.0.0.1:8000/api/task-create/';

            if (activeItem != null) {
                var url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`;
                activeItem = null;
            }

            var title = document.getElementById('title').value;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({'title':title})
            }
            ).then(function(response) {
                buildList();
                document.getElementById('form').reset();
            });
        });

    }

    //Edit Task
    function editItem(item) {
        console.log('Item Clicked', item);
        activeItem = item;
        document.getElementById('title').value = activeItem.title;
    }


    // Delete Task
    function deleteItem(item){
        console.log('Delete clicked');
        var url = `http://127.0.0.1:8000/api/task-delete/${item.id}/`;
        fetch(url, {
            method:'DELETE',
            headers:{
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            }
        }).then((response) => {
            buildList();
        });
    }

    // Strike Task
    function strikeUnstrike(item) {
        console.log('Strike Clicked');
        item.completed = !item.completed;
        // URL
        var url = `http://127.0.0.1:8000/api/task-update/${item.id}/`;
        fetch(url, {
            method:'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body:JSON.stringify({'title':item.title, 'completed': item.completed})
        }).then((response) => {
            buildList();
        });
    }

    var list_snapshot = [];

    function buildList(){
        var wrapper = document.getElementById('list-wrapper');
        //wrapper.innerHTML = ''

        var url = 'http://127.0.0.1:8000/api/task-list/';

        fetch(url)
        .then((resp) => resp.json())
        .then(function(data){
            console.log('Data:', data);

            var list = data;
            for (var i in list){

                try{
                    document.getElementById(`data-row-${i}`).remove();
                }catch(err){

                }

                // Strike If Task is True
                var title = `<span class="title">${list[i].title}</span>`;

                if (list[i].completed == true){
                    title = `<strike class="title">${list[i].title}</strike>`;
                }

                var item = `
                <div id="data-row-${i}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        ${title}
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit </button>
                    </div>
                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                </div>

            `;
                wrapper.innerHTML += item;

            }

            // Remove list that deleted
            if (list_snapshot.length > list.length){
                for (var i = list.length; i < list_snapshot.length; i++){
                    document.getElementById(`data-row-${i}`).remove();
                }
            }

            list_snapshot = list;


            for (var i in list){
                var editBtn = document.getElementsByClassName('edit')[i];
                var deleteBtn = document.getElementsByClassName('delete')[i];
                var title = document.getElementsByClassName('title')[i];


                editBtn.addEventListener('click', (function(item){
                    return function(){
                        editItem(item);
                    }
                })(list[i]));


                deleteBtn.addEventListener('click', (function(item){
                    return function(){
                        deleteItem(item);
                    }
                })(list[i]));




                title.addEventListener('click', (function(item){
                    return function(){
                        strikeUnstrike(item);
                    }
                })(list[i]));


            }


        });
    }

    /*
        key components:
        "activeitem" = null until an edit button is clicked. will contain object of item we are editing
        "list_snapshot" = will contain previous state of list. used for removing extra rows on list update

        process:
        1 - fetch data and build rows "buildlist()"
        2 - create item on form submit
        3 - edit item click - prefill form and change submit url
        4 - delete item - send item id to delete url
        5 - cross out completed task - event handle updated item

        notes:
        -- add event handlers to "edit", "delete", "title"
        -- render with strike through items completed
        -- remove extra data on re-render
        -- csrf token
    */


    buildList();
    form();

}());

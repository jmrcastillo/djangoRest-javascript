

import {buildList} from './list';

//to know whether editing item or creating new one
var activeItem = null

//django-rest token
export function getCookie(name) {
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


export function form() {

    var form = document.getElementById('form-wrapper')

    form.addEventListener('submit', function(e) {
        e.preventDefault()
        console.log('Form Submitted');
        //
        //Create Task
        var url = 'http://127.0.0.1:8000/api/task-create/'

        if (activeItem != null) {
            var url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
            activeItem = null
        }

        var title = document.getElementById('title').value
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({'title':title})
        }
        ).then(function(response) {
            buildList()
            document.getElementById('form').reset()
        })
    })

}

//Edit Task
export function editItem(item) {
    console.log('Item Clicked', item)
    activeItem = item
    document.getElementById('title').value = activeItem.title
}


// Delete Task
export function deleteItem(item){
    console.log('Delete clicked')
    var url = `http://127.0.0.1:8000/api/task-delete/${item.id}/`
    fetch(url, {
        method:'DELETE',
        headers:{
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    }).then((response) => {
        buildList()
    })
}

// Strike Task
export function strikeUnstrike(item) {
    console.log('Strike Clicked');
    item.completed = !item.completed
    // URL
    var url = `http://127.0.0.1:8000/api/task-update/${item.id}/`
    fetch(url, {
        method:'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({'title':item.title, 'completed': item.completed})
    }).then((response) => {
        buildList()
    })
}

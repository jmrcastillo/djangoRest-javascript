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

buildList()

function buildList(){
    var wrapper = document.getElementById('list-wrapper')
    //wrapper.innerHTML = ''



    var url = 'http://127.0.0.1:8000/api/task-list/'

    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        console.log('Data:', data)

        var list = data
        for (var i in list){


            try{
                document.getElementById(`data-row-${i}`).remove()
            }catch(err){

            }



            var title = `<span class="title">${list[i].title}</span>`
            if (list[i].completed == true){
                title = `<strike class="title">${list[i].title}</strike>`
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

            `
            wrapper.innerHTML += item

        }

        if (list_snapshot.length > list.length){
            for (var i = list.length; i < list_snapshot.length; i++){
                document.getElementById(`data-row-${i}`).remove()
            }
        }

        list_snapshot = list


        for (var i in list){
            var editBtn = document.getElementsByClassName('edit')[i]
            var deleteBtn = document.getElementsByClassName('delete')[i]
            var title = document.getElementsByClassName('title')[i]


            editBtn.addEventListener('click', (function(item){
                return function(){
                    editItem(item)
                }
            })(list[i]))


            deleteBtn.addEventListener('click', (function(item){
                return function(){
                    deleteItem(item)
                }
            })(list[i]))




            title.addEventListener('click', (function(item){
                return function(){
                    strikeUnstrike(item)
                }
            })(list[i]))


        }


    })
}


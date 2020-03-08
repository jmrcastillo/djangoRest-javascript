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


import {buildList} from './list';
import {form, editItem, deleteItem} from './form';


buildList()
form()

//tabs.....

var tabs = document.getElementsByClassName("tab")
    

for(var tab of tabs){
    tab.style.display = "none"
}


function displayTab(id){
   
   for(var tab of tabs){
    tab.style.display = "none"
   }
   
    document.getElementById(id).style.display = "block"
}


var buttons = document.querySelectorAll("button")
for(var button of buttons){
    button.addEventListener("click", function(){
        //nuima klase nuo visu
        for(var x of buttons){
            x.classList.remove("selected")
        }
        this.classList.add("selected")
    })
}


//comments..........

const addPostForm = document.getElementById('add-post')
const postsContainer = document.getElementById('posts')
let editPostId = null
const API_ENDPOINTS = {
    post: `https://testapi.io/api/Lukoseviciene7/resource/newPosts`,
    get: `https://testapi.io/api/Lukoseviciene7/resource/newPosts`,
    getPostById: (id) => `https://testapi.io/api/Lukoseviciene7/resource/newPosts/${id}`,
    edit: (id) => `	https://testapi.io/api/Lukoseviciene7/resource/newPosts/${id}`,
    delete: (id) => `https://testapi.io/api/Lukoseviciene7/resource/newPosts/${id}`
}
const handleButtonName = (name) => {
    const btn = document.querySelector('button[type=submit]')
    btn.innerText = name
}
const getData = (url) => {
    return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(err => console.log(err))
}
const getPostById = (id) => {
    const url = API_ENDPOINTS.getPostById(id)
    return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(err => console.log(err))
}
const editData = (url, data) => {
    return fetch(url, {
        method: 'PUT',
        body: data,
    })
    .then(response => response.json())
    .then(data => data)
    .catch(err => console.log(err))
}
const deletePost = (id) => {
    const url = API_ENDPOINTS.delete(id)
    return fetch(url, {
        method: 'DELETE',
    })
    .then(response => {
        response.status === 204 &&
        document.getElementById(id).remove()
    })
    .catch(err => console.log(err))
}
const postData = (url, data) => {
    return fetch(url, {
        method: 'POST',
        body: data,
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
    .catch(err => console.log(err))       
}


const getCurrentTime = () => {
    const currentTime = new Date().toLocaleString()
    return `<p>${currentTime}</p>`
  }

  const formSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData('imageUrl', document.getElementById('image-upload').value)
    if(editPostId) {
        handlePostUpdate(formData, editPostId)
    } else {
        const newPost = await postData(API_ENDPOINTS.post, formData)
        postsContainer.innerHTML += postTemplate(newPost)
    }
    e.target.reset()
}


const postTemplate = (data) => {
    const x = JSON.stringify(data)
    return `
        <div id=${data.id} class="post">
            <h3>${data.title}</h3>
            <img src="${data.imageUrl}" alt="Post image">
            <p>${data.content}</p>
            ${getCurrentTime()}
            <div class ="change">
            <button class="edit" onClick=handlePostEdit(${data.id})>Edit</button>
            <button class="delete" onClick=deletePost(${data.id})>Delete</button>
            </div> 
        </div>
    `
}
const handlePostEdit = async (id) => {
    editPostId = id
    const postDataById = await getPostById(id)
    const arr = [...addPostForm.getElementsByTagName('input')];
    arr.forEach(input => {
        input.value = postDataById[input.name]
    })
    handleButtonName('Update Post')
}
const handlePostUpdate = async (formData, id) => {
    const updatedPost = await editData(API_ENDPOINTS.edit(id), new URLSearchParams(formData))
    document.getElementById(id).remove()
    postsContainer.innerHTML += postTemplate(updatedPost)
    editPostId = null
    handleButtonName('Add Post')
}
const handleFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    if(editPostId) {
        handlePostUpdate(formData, editPostId)
    } else {
        const newPost = await postData(API_ENDPOINTS.post, formData)
        postsContainer.innerHTML += postTemplate(newPost)
    }
    e.target.reset()
}
addPostForm.addEventListener('submit', handleFormSubmit)
window.onload = async () => {
    const posts = await getData(API_ENDPOINTS.get)
    posts.data.forEach(post => {
        postsContainer.innerHTML += postTemplate(post)
    })
}


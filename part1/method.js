export const posturl = "https://httpbin.org/post"
export const geturl = "https://httpbin.org/get"
export const puturl = "https://httpbin.org/put"
export const deleteurl = "https://httpbin.org/delete"

export function postBtn(){
  document.querySelector('#id').value++;
  let form = new FormData();
  form.append('id',document.getElementById('id').value);
  form.append('article_name',document.getElementById('article_name').value);
  form.append('article_body',document.getElementById('article_body').value);
  form.append('date',document.getElementById('date').value);
  let string = new URLSearchParams(form).toString();

  fetch(posturl, {
    method: 'POST',
    body: string,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })

  .then(status)
  .then(response => response.text())
  .then(data => document.getElementById('response').textContent = data)
  .catch(error => console.log(error))
};

export function getBtn(){
  document.querySelector('#id').value++;
  let form = new FormData();
  form.append('id',document.getElementById('id').value);
  form.append('article_name',document.getElementById('article_name').value);
  form.append('article_body',document.getElementById('article_body').value);
  form.append('date',document.getElementById('date').value);
  fetch(geturl)
    .then(status)
    .then(response => response.text())
    .then(data => document.getElementById('response').textContent = data)
    .catch(error => console.log(error));
};

export async function putBtn(){
  document.querySelector('#id').value++;
  let form = new FormData(document.forms[0]);
  form.append('id',document.getElementById('id').value);
  form.append('article_name',document.getElementById('article_name').value);
  form.append('article_body',document.getElementById('article_body').value);
  form.append('date',document.getElementById('date').value);
  let string = new URLSearchParams(form).toString();

  await fetch(puturl, {
    method: 'PUT',
    body: string,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })

  .then(status)
  .then(response => response.text())
  .then(data => document.getElementById('response').textContent = data)
  .catch(error => console.log(error));
};

export async function deleteBtn(){
  document.querySelector('#id').value++;
  await fetch(deleteurl, {
      method: 'DELETE',
      body: `id = ${document.querySelector('#id').value}`,
  })

  .then(status)
  .then(response => response.text())
  .then(data => document.getElementById('response').textContent = data)
  .catch(error => console.log(error));
};

window.addEventListener('DOMContentLoaded', function() {
  function status(response) {
    if(response.status.ok) {
      return Promise.resolve(response);
    }
    else{
      return Promise.reject(new Error(reponse.status));
    }
  }
})

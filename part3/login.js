window.addEventListener('DOMContentLoaded', function() {
  function createLoginDialog() {
    let dialog = document.createElement('dialog');

    dialog.innerHTML = `
      <form>
        <fieldset>
          <legend>Login</legend>
          <div>
            <label for="email">Email</label>
            <input id="email" name="email" type="email">
          </div>
          <div>
            <label for="password">Password</label>
            <input id="password" name="password" type="password">
          </div>
          <menu>
            <button type="button" class="cancel">Cancel</button>
            <button type="submit" class="save">Login</button>
          </menu>
        </fieldset>
      </form>`;

    dialog.querySelector('.cancel').addEventListener('click', () => {
      dialog.remove();
    })

    dialog.querySelector('.save').addEventListener('click', (e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          Array.from(document.querySelectorAll('blog-post')).forEach(post => {
            post.editable = true;
          })
          dialog.remove();
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          alert(`${errorCode}: ${errorMessage}`);
        });
    });
    document.querySelector('main').appendChild(dialog);
    dialog.showModal();
  }

  function logout() {
    firebase.auth().signOut()
      .then(() => {
        Array.from(document.querySelectorAll('blog-post')).forEach(post => {
          post.editable = false;
        })
        document.querySelector('#addBlog').style.visibility = 'hidden';
      });
  }

  function getBlogs() {
    let db = firebase.firestore();
    db.collection('blogs').orderBy('date', 'desc')
      .onSnapshot(doc => {
        document.querySelector('#list').innerHTML = '';
        doc.forEach(blogInfo => {
          const title = blogInfo.get('title');
          const author = blogInfo.get('author');
          const date = blogInfo.get('date').toDate().toISOString().split('T')[0];
          const content = blogInfo.get('content');

          let blogElem = document.createElement('blog-post');
          blogElem.setAttribute('data-id', blogInfo.id);
          blogElem.innerHTML = `
          <span slot="title">${title}</span>
          <span slot="author">${author}</span>
          <span slot="date">${date}</span>
          <span slot="content">${content}</span>`
          if (firebase.auth().currentUser) {
            blogElem.editable = true;
          }
          document.querySelector('#list').append(blogElem);
        })
      });
  }

  function createAddDialog() {
    let dialog = document.createElement('dialog');

    dialog.innerHTML = `
      <form>
        <fieldset>
          <legend>Add Blog</legend>
          <div>
            <label for="add-title">Title</label>
            <input id="add-title" name="add-title">
          </div>
          <div>
            <label for="add-content">Content</label>
            <textarea id="add-content" name="add-content"></textarea>
          </div>
          <button type="button" class="cancel">Cancel</button>
          <button type="submit" class="save">Add</button>
        </fieldset>
      </form>`;

    dialog.querySelector('.cancel').addEventListener('click', () => {
      dialog.remove();
    })

    dialog.querySelector('.save').addEventListener('click', (e) => {
      e.preventDefault();
      const title = document.querySelector('#add-title').value;
      const content = document.querySelector('#add-content').value;
      firebase.firestore().collection('blogs').add({
        title: title,
        author: firebase.auth().currentUser.email,
        date: new Date(),
        content: content,
      });
      dialog.remove();
    });

    document.querySelector('main').appendChild(dialog);
    dialog.showModal();
  }

  getBlogs();
  document.querySelector('#addBlog').addEventListener('click', createAddDialog);


  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      document.querySelector('#addBlog').style.visibility = 'visible';
      document.querySelector('#login').removeEventListener('click', createLoginDialog);
      document.querySelector('#login').addEventListener('click', logout);
      document.querySelector('#login').textContent = 'Logout';
    }
    else {
      document.querySelector('#login').removeEventListener('click', logout);
      document.querySelector('#login').textContent = 'Login';
      document.querySelector('#login').addEventListener('click', createLoginDialog);
    }
  });

});

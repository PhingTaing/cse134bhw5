class BlogPost extends HTMLElement {
  constructor() {
    super();
    const template = document.querySelector('#postTemp').content;
    this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true));
  }

  set editable(value) {
    if (value) {
      this.shadowRoot.querySelector('menu').style.visibility = 'visible';
      this.shadowRoot.querySelector('.edit').addEventListener('click', () => this.createEditDialog());
      this.shadowRoot.querySelector('.delete').addEventListener('click', () => this.createDeleteDialog());
    }
    else {
      this.shadowRoot.querySelector('menu').style.visibility = 'hidden';
    }
  }

  createEditDialog() {
    let title = this.querySelector('span[slot="title"]').textContent;
    let content = this.querySelector('span[slot="content"]').textContent;
    let dialog = document.createElement('dialog');

    dialog.innerHTML = `
      <form>
        <fieldset>
          <legend>Edit</legend>
          <div>
            <label for="edit-title">Title</label>
            <input id="edit-title" name="edit-title" value="${title}">
          </div>
          <div>
            <label for="edit-content">Content</label>
            <textarea id="edit-content" name="edit-content">${content}</textarea>
          </div>
          <menu>
            <button type="button" class="cancel">Cancel</button>
            <button type="submit" class="save">Save</button>
          </menu>
        </fieldset>
      </form>`;

    dialog.querySelector('.cancel').addEventListener('click', () => {
      dialog.remove();
    })

    dialog.querySelector('.save').addEventListener('click', (e) => {
      e.preventDefault();
      const title = document.querySelector('#edit-title').value;
      const content = document.querySelector('#edit-content').value;

      firebase.firestore().collection('blogs').doc(this.dataset.id).set({
        title: title,
        date: new Date(),
        content: content,
        author: firebase.auth().currentUser.email,
      });
      dialog.remove();
    });
    document.querySelector('main').appendChild(dialog);
    dialog.showModal();
  }

  createDeleteDialog() {
    let dialog = document.createElement('dialog');
    dialog.innerHTML = `
    <form method="dialog">
      <h3>Delete Blog</h3>
      <p>Delete this blog?</p>
      <menu>
        <button class="cancel" value="false">Cancel</button>
        <button class="save" value="true">Confirm</button>
      </menu>
    </form>`

    dialog.addEventListener('close', () => {
      if (dialog.returnValue === 'true') {
        firebase.firestore().collection('blogs').doc(this.dataset.id).delete();
      }
      dialog.remove();
    })
    document.body.appendChild(dialog);
    dialog.showModal();
  }
}

customElements.define('blog-post', BlogPost);

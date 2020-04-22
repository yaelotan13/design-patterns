const post = (() => {
  class _Post {
    constructor(header, body, image, key) {
      this.header = header;
      this.body = body;
      this.image = image;
      this.key = key;
      this.initPostElements();
    }

    initPostElements() {
      this.createPostElements();
      this.setClassNames();
      this.setAttributes();
      this.appendChildesToPostContent();
      this.setBackgroundImage();
      this.setContent();
    }

    createPostElements() {
      this.backgroundImageContainer = document.createElement('div');
      this.contentContainer = document.createElement('div');
      this.separatorDiv = document.createElement('div');
      this.postName = document.createElement('h3');
      this.postContent = document.createElement('p');
      this.beforeShareIcon = document.createElement('div');
      this.editIcon = document.createElement('a');
      this.shareIcon = document.createElement('a');
    }

    setClassNames() {
      this.backgroundImageContainer.id = 'Post-image';
      this.contentContainer.id = 'content-container';
      this.separatorDiv.className = 'separator-div';
      this.postName.className = 'Post-headline';
      this.postContent.id = 'Post-content';
      this.beforeShareIcon.className = 'before-share';
      this.editIcon.className = 'fa fa-pen edit-Post-but';
      this.shareIcon.className = 'fa fa-share-alt';
    }

    setAttributes() {
      this.editIcon.setAttribute('title', 'edit this Post');
      this.shareIcon.setAttribute('href', '#');
      this.shareIcon.setAttribute('title', 'share this Post');
    }

    appendChildesToPostContent() {
      this.contentContainer.appendChild(this.separatorDiv);
      this.contentContainer.appendChild(this.postName);
      this.contentContainer.appendChild(this.postContent);
      this.contentContainer.appendChild(this.beforeShareIcon);
      this.contentContainer.appendChild(this.editIcon);
      this.contentContainer.appendChild(this.shareIcon);
    }

    setBackgroundImage() {
      this.backgroundImageContainer.setAttribute('style', `background-image: url(${this.image})`);
    }

    setContent() {
      this.postName.innerHTML = this.header;
      this.postContent.innerHTML = this.body;
    }

    bindUpdatePostButton(handler) {
      document.getElementById('edit-Post-but').addEventListener('click', function () {
        handler(this);
      });
    }

    createPostNode() {
      const newPost = document.createElement('article');

      newPost.className = 'post';
      newPost.appendChild(this.backgroundImageContainer);
      newPost.appendChild(this.contentContainer);

      return newPost;
    }
  }

  const displayPost = (curNode) => {
    const articlesContainer = document.getElementById('articles');
    articlesContainer.appendChild(curNode);
  };

  const createNewPost = (header, body, image, key) => {
    const newPost = new _Post(header, body, image, key);
    const postNode = newPost.createPostNode();

    displayPost(postNode);

    return newPost;
  };

  return {
    createNewPost,
  };
})();

export default post;

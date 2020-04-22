import { _ } from 'underscore';
import i18next from 'i18next';
import post from './post';
import utility from './view-utils';

let isNewPost = false;

class ViewCls {
  static createNewPost(header, body, image, key, postid) {
    const newPost = post.createNewPost(header, body, image, key, postid);
    utility.setOnEditButtonClicked(key, newPost);
  }

  static updatePost(header, body, image, key, postid) {
    const currentHeader = document.getElementsByClassName('Post-headline')[key];
    const currentBody = document.getElementsByClassName('Post-content')[key];
    const currentImage = document.getElementsByClassName('post-image')[key];

    currentImage.setAttribute('style', `background-image: url(${image})`);
    currentHeader.innerHTML = header;
    currentBody.innerHTML = body;
    const newPost = {
      header, body, image, key, postid,
    };
    utility.setOnEditButtonClicked(key, newPost);
  }

  static getNumberOfNextPost() {
    return document.getElementsByClassName('edit-Post-but').length;
  }

  static getCurrentPostID() {
    return utility.getPostID();
  }

  static getCurrentPostKey() {
    return utility.getPostKey();
  }

  static getElementsValueByID(elementID) {
    return document.getElementById(elementID).value;
  }

  static showUserDetails(user) {
    document.getElementById('user-name').innerHTML = user.firstname;
    document.getElementById('description').innerHTML = user.status;
  }

  static showUserErrorMessage() {
    document.getElementById('body').innerHTML = i18next.t('authority-error');
  }

  static showNewPostErrorMessage(message) {
    utility.removeClass('show-error-message', 'hideElement');
    document.getElementById('show-error-message').innerHTML = i18next.t(`${message}`);
  }

  static showNoPostsYetMessage() {
    document.getElementById('display-no-posts-message').classList.remove('hideElement');
    document.getElementById('display-no-posts-message').innerHTML = i18next.t('no posts');
  }

  static removeNoPostsYetMessage() {
    document.getElementById('display-no-posts-message').classList.add('hideElement');
  }

  static stopPlusSignCallForAction() {
    document.getElementById('add-post-but').style.animation = 'none';
  }

  static closePostPopupWindow() {
    document.getElementById('add-Post-container').classList.add('hideElement');
  }

  static resetUpdatePostPopupWindow() {
    const editPostModel = document.getElementById('edit-Post-container');

    document.getElementById('edit-blog-name').value = '';
    document.getElementById('edit-post-content').innerHTML = '';
    editPostModel.classList.add('hideElement');
  }

  static colorTheTargets(targets, searchWords) {
    const bodies = utility.getBodyElements(targets);
    const headers = utility.getHeadElements(targets);

    for (let i = 0; i < searchWords.length; i += 1) {
      for (let j = 0; j < targets.length; j += 1) {
        const re = new RegExp(`${searchWords[i]}`, 'gi');

        if (bodies.length > 0) {
          bodies[j].innerHTML = bodies[j].innerHTML.replace(re, `<mark>${searchWords[i]}</mark>`);
        }

        if (headers.length > 0) {
          headers[j].innerHTML = headers[j].innerHTML.replace(re, `<mark>${searchWords[i]}</mark>`);
        }
      }
    }
  }

  static hideAllPosts() {
    document.getElementById('articles').innerHTML = '';
  }

  static showNoPostsMessage() {
    document.getElementById('display-no-posts-message').classList.remove('hideElement');
    document.getElementById('display-no-posts-message').innerHTML = i18next.t('post-not-found');
    document.getElementById('display-num-found-posts').classList.add('hideElement');
  }

  static hideNoPostsMessage() {
    document.getElementById('display-no-posts-message').classList.add('hideElement');
  }

  static hideNumOfPostsFound() {
    const showNumOfPostsFound = document.getElementById('display-num-found-posts');
    showNumOfPostsFound.classList.add('hideElement');
  }

  static showNumOfFoundPosts(num) {
    const showNumOfPostsFound = document.getElementById('display-num-found-posts');
    let message = i18next.t('posts-found');
    const numPosts = num.toString();

    message = numPosts.concat(message);
    showNumOfPostsFound.innerHTML = message;
    showNumOfPostsFound.classList.remove('hideElement');
  }

  static userIsWritingAPost() {
    const addPostModal = document.getElementById('add-Post-container');
    const editPostModel = document.getElementById('edit-Post-container');

    return !(addPostModal.classList.contains('hideElement') && editPostModel.classList.contains('hideElement'));
  }

  static updatePostToView(originalPostName, postName, newBody) {
    const posts = document.getElementsByClassName('post');

    for (let i = 0; i < posts.length; i += 1) {
      const content = posts[i].children[1];
      const curPostName = content.children[1];

      // decide if to search by the original Post name
      const targetPostName = originalPostName === undefined ? postName : originalPostName;

      if (curPostName.innerHTML === targetPostName) {
        const body = content.children[2];
        body.innerHTML = newBody;
        curPostName.innerHTML = postName;
      }
    }
  }

  static getNewPostData() {
    const header = ViewCls.getElementsValueByID('new-blog-name');
    const body = ViewCls.getElementsValueByID('blog-body');
    const image = document.getElementById('file').files[0];

    return {
      header,
      body,
      image,
      isNewPost,
    };
  }

  static getUpdatedPost() {
    const updatedPostHeader = ViewCls.getElementsValueByID('edit-blog-name');
    const updatedBody = document.getElementById('edit-post-content').innerHTML;

    return {
      updatedPostHeader,
      updatedBody,
    };
  }

  static bindWindowOnLoad(handler) {
    window.addEventListener('load', handler);
  }

  static bindPublishNewPost(handler) {
    document.getElementById('publish-new-Post-but').addEventListener('click',
      handler);
  }

  static bindSearch(handler) {
    window.addEventListener('keyup', handler);
  }
}

function getView() {
  return ViewCls;
}

export default getView;

document.getElementsByClassName('close')[0].addEventListener('click', utility.closeNewPostPopup);
document.getElementById('add-post-but').addEventListener('click', () => {
  isNewPost = true;
  utility.showAddNewPostWindow({
    header: '',
    body: ' ',
  });
});

const stickHeader = _.debounce(utility.stickHeaderToTop, 10);
window.addEventListener('scroll', stickHeader);

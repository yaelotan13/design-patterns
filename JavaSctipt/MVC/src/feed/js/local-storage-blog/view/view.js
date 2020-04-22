import i18next from 'i18next';
import { _ } from 'underscore';
import post from './post';
import utility from './view-utils';

const View = (() => {
  class ViewCls {
    static createNewPost(header, body, image, key) {
      const newPost = post.createNewPost(header, body, image, key);
      //utility.setOnEditButtonClicked(key, newPost);
    }

    static getElementsValueByID(elementID) {
      return document.getElementById(elementID).value;
    }

    static getFile(elementID) {
      return document.getElementById(elementID).files[0];
    }

    static createURL(file) {
      return window.URL.createObjectURL(file);
    }

    static showNewPostErrorMessage(message) {
      utility.removeClass('show-error-message', 'hideElement');
      document.getElementById('show-error-message').innerHTML = i18next.t(`${message}`);
    }

    // static showEditPostPopup(curPost) {
    //   utility.removeClass('edit-Post-container', 'hideElement');
    //   ViewCls.hidePostErrorMessage();
    //
    //   document.getElementById('edit-blog-name').value = curPost.header;
    //   document.getElementById('edit-Post-content').innerHTML = curPost.body;
    //   popupWindow.saveOriginalPost(curPost);
    // }

    static resetAddNewPostPopupWindow() {
      document.getElementById('new-blog-name').value = '';
      document.getElementById('blog-body').value = '';
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

    static showNoPostsMassage() {
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

      if (addPostModal.classList.contains('hideElement') || editPostModel.classList.contains('hideElement')) {
        return false;
      }

      return true;
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

      return {
        header,
        body,
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

  return {
    ViewCls,
  };
})();

export default View;

document.getElementsByClassName('close')[0].addEventListener('click', utility.closeNewPostPopup);
document.getElementsByClassName('close')[1].addEventListener('click', utility.closeEditPostPopup);
document.getElementById('add-post-but').addEventListener('click', utility.showAddNewPostWindow);
const stickHeader = _.debounce(utility.stickHeaderToTop, 10);
window.addEventListener('scroll', stickHeader);

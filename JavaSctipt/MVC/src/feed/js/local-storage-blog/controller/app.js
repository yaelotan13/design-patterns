import { _ } from 'underscore';
import i18next from 'i18next';
import backgroundImage from '../view/background-images';
import popupWindow from './popup-window';

const Controller = (() => {
  const getNumDefaultPosts = () => 4;

  class ControllerCls {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.bgImage = backgroundImage.getInstance(model, view, i18next.t('image-pool'));
      this.bindEvents();
    }

    bindEvents() {
      const popup = popupWindow.getInstance(this.model, this.view, this.bgImage);
      this.view.bindWindowOnLoad(this.loadAllPostsFromDB());
      this.view.bindPublishNewPost(popup.createNewPostFromPopup.bind(popup));
      // this.view.onUpdatePost(popup.updateChangesToPost.bind(popup));
      this.view.bindSearch(_.debounce(this.startSearch.bind(this), 400));
    }

    createDefaultPosts() {
      const NUM_DEFAULT_POSTS = getNumDefaultPosts();

      for (let i = 0; i < NUM_DEFAULT_POSTS; i += 1) {
        let header;
        let body;

        switch (i) {
          case 0: {
            header = i18next.t('post-1-header');
            body = i18next.t('post-1-body');
            break;
          }
          case 1: {
            header = i18next.t('post-2-header');
            body = i18next.t('post-2-body');
            break;
          }

          case 2: {
            header = i18next.t('post-3-header');
            body = i18next.t('post-3-body');
            break;
          }

          case 3: {
            header = i18next.t('post-4-header');
            body = i18next.t('post-4-body');
            break;
          }

          default:
        }

        const image = this.bgImage.getRandomBackgroundImage();
        const key = this.model.savePost(header, body, image);
        this.view.createNewPost(header, body, image, key);
      }
    }

    initDefaultPosts() {
      this.bgImage.insertImagesPoolToDB();
      this.createDefaultPosts();
    }

    // need this function because the localStorage store the posts out of order
    // and we relay of the order when assigning the posts the handler for updating
    static sortPosts(posts) {
      const sortedPosts = posts.sort((post1, post2) => {
        return post1.key - post2.key;
      });

      return sortedPosts;
    }

    displayPosts(posts) {
      const sortedPosts = ControllerCls.sortPosts(posts);
      sortedPosts.forEach((post) => {
        this.view.createNewPost(post.header, post.body, post.image, post.key);
      }, this);
    }

    loadAllPostsFromDB() {
      if (this.model.isEmpty()) {
        this.initDefaultPosts();
        return;
      }

      const posts = this.model.values();
      this.displayPosts(posts);
    }

    showOnlyTargets(targets, statement) {
      this.view.hideAllPosts();
      if (targets.length === 0) {
        this.view.showNoPostsMassage(); // TODO rename to message
        return;
      }

      this.view.showNumOfFoundPosts(targets.length);
      this.displayPosts(targets);
      this.view.colorTheTargets(targets, statement);
    }

    startSearch() {
      if (this.view.userIsWritingAPost()) {
        return;
      }

      const val = this.view.getElementsValueByID('search-input');
      if (val.length === 0) {
        this.view.hideNumOfPostsFound();
        this.view.hideAllPosts();
        this.loadAllPostsFromDB();
        return;
      }
      console.log('searchWords');
      this.view.hideNoPostsMessage();
      // TODO find a more efficient way
      this.loadAllPostsFromDB();
      const { targetPosts, searchWords } = this.model.searchBlog(val);
      console.log(targetPosts);
      console.log(searchWords);
      this.showOnlyTargets(targetPosts, searchWords);
    }
  }

  return ControllerCls;
})();

export default Controller;

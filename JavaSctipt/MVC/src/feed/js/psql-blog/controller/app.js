import { _ } from 'underscore';

import getPopUpWindowInstance from './popup-window';

class ControllerCls {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.bindEvents().catch(() => { console.log('bind error'); });
    this.getUserDetails().catch(() => { console.log('get user error'); });
  }

  async bindEvents() {
    const popup = getPopUpWindowInstance(this.model, this.view);
    await this.view.bindWindowOnLoad(this.loadAllPostsFromDB());
    await this.view.bindPublishNewPost(popup.createNewPostFromPopup.bind(popup));
    // this.view.onUpdatePost(popup.updateChangesToPost.bind(popup));
    this.view.bindSearch(_.debounce(this.startSearch.bind(this), 400));
  }

  async getUserDetails() {
    await this.model.getUserDetails().then((user) => {
      if (!user) {
        this.view.showUserErrorMessage();
        return;
      }

      this.view.showUserDetails(user);
    });
  }

  displayPosts(posts) {
    let key = 0;
    if (posts.length === 0) {
      this.view.showNoPostsYetMessage();
      return;
    }

    this.view.removeNoPostsYetMessage();
    this.view.stopPlusSignCallForAction();

    posts.forEach((post) => {
      // eslint-disable-next-line no-plusplus
      this.view.createNewPost(post.header, post.body, post.image, key++, post.postid);
    }, this);
  }

  async loadAllPostsFromDB() {
    const posts = await this.model.values();
    this.displayPosts(posts);
  }

  loadAllPostsFromCache() {
    const posts = this.model.getCachedPosts();
    this.displayPosts(posts);
  }

  showOnlyTargets(targets, statement) {
    this.view.hideAllPosts();
    if (targets.length === 0) {
      this.view.showNoPostsMessage();
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
      this.loadAllPostsFromCache();
      return;
    }

    this.view.hideNoPostsMessage();
    this.loadAllPostsFromCache();
    const { targetPosts, searchWords } = this.model.searchBlog(val);
    this.showOnlyTargets(targetPosts, searchWords);
  }
}

function getController(model, view) {
  return new ControllerCls(model, view);
}

export default getController;

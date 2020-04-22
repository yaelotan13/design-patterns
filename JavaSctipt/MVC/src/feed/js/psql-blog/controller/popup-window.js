class PopupWindowCls {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  getOriginalPostElements() {
    const { header, image } = this.currentUpdatingPost;

    return {
      header,
      image,
    };
  }

  showPostIsInvalidError(header, body) {
    if (this.model.headerAlreadyExists(header)) {
      this.view.showNewPostErrorMessage('header-already-exists');
    }
    if (body.length === 0) {
      this.view.showNewPostErrorMessage('add-content');
    }
  }

  async createNewPostFromPopup() {
    const {
      header, body, image, isNewPost,
    } = this.view.getNewPostData();

    this.view.removeNoPostsYetMessage();
    this.view.stopPlusSignCallForAction();

    if (isNewPost) {
      const { image: imagePath, postid } = await this.model.savePost(header, body, image).catch(() => console.log('save image error'));
      const key = this.view.getNumberOfNextPost();
      this.view.createNewPost(header, body, imagePath, key, postid);
    } else {
      const postId = this.view.getCurrentPostID();
      const key = this.view.getCurrentPostKey();
      const imagePath = await this.model.updatePost(header, body, image, postId);
      this.view.updatePost(header, body, imagePath, key, postId);
    }

    this.view.closePostPopupWindow();
  }

  updateChangesToPost() {
    const { updatedPostHeader, updatedBody } = this.view.getUpdatedPost();
    const { header: originalPostHeader, image: curImage } = this.getOriginalPostElements();

    if (this.postIsInvalid(updatedPostHeader, updatedBody)) {
      this.showPostIsInvalidError(updatedPostHeader, updatedBody);
      return;
    }

    this.view.updatePostToView(originalPostHeader, updatedPostHeader, updatedBody);
    this.model.updatePost(originalPostHeader, updatedPostHeader, updatedBody, curImage);
    this.view.resetUpdatePostPopupWindow();
  }
}

function getPopUpWindowInstance(model, view, backgroundImage) {
  return new PopupWindowCls(model, view, backgroundImage);
}

export default getPopUpWindowInstance;

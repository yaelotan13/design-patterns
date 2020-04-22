const PopUpWindow = (() => {
  class PopupWindowCls {
    constructor(model, view, backgroundImage) {
      this.model = model;
      this.view = view;
      this.backgroundImage = backgroundImage;
    }

    getOriginalPostElements() {
      const { header, image } = this.currentUpdatingPost;

      return {
        header,
        image,
      };
    }

    saveOriginalPost(curPost) {
      console.log('got here');
      console.log(curPost);
      this.currentUpdatingPost = curPost;
    }

    postIsInvalid(header, body) {
      return this.model.headerAlreadyExists(header) || body.length === 0;
    }

    showPostIsInvalidError(header, body) {
      if (this.model.headerAlreadyExists(header)) {
        this.view.showNewPostErrorMessage('header-already-exists');
      }
      if (body.length === 0) {
        this.view.showNewPostErrorMessage('add-content');
      }
    }

    createNewPostFromPopup() {
      const { header, body } = this.view.getNewPostData();

      if (this.postIsInvalid(header, body)) {
        // TODO add errors in this case
        this.showPostIsInvalidError(header, body);
        return;
      }

      // TODO find a way to not call it here
      const image = this.backgroundImage.getBackgroundImage();
      const key = this.model.savePost(header, body, image);
      this.view.createNewPost(header, body, image, key);
      this.view.resetAddNewPostPopupWindow();
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

  function getInstance(model, view, backgroundImage) {
    return new PopupWindowCls(model, view, backgroundImage);
  }

  return {
    getInstance,
  };
})();

export default PopUpWindow;

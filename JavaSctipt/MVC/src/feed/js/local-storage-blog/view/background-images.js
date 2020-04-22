const backgroundImage = (() => {
  let utilityView;

  function initUtility(view) {
    utilityView = view;
  }

  const utility = {
    getFileSelected() {
      const fileSelected = utilityView.getFile('file');
      return !fileSelected ? null : fileSelected;
    },
    getImageURL() {
      const fileSelected = utility.getFileSelected();
      if (!fileSelected) {
        return null;
      }

      // TODO check if I can directly return the function
      const url = utilityView.createURL(fileSelected);
      return url;
    },
  }

  class BackgroundImages {
    constructor(model, view, IMAGE_POOL) {
      this.model = model;
      this.view = view;
      this.IMAGE_POOL = IMAGE_POOL;
      initUtility(this.view);
    }

    getRandomBackgroundImage() {
      const images = this.model.getImagePool().split(',');
      const randIndex = Math.floor(Math.random() * images.length);
      const curImage = images[randIndex];

      images.splice(randIndex, 1); // remove the chosen image from the pool
      this.model.setImagePool(images.toString()); // update the image pool

      return curImage;
    }

    insertImagesPoolToDB() {
      this.model.setImagePool(this.IMAGE_POOL.toString()); // TODO need the tostring?
    }

    getBackgroundImage() {
      let image = utility.getImageURL();

      if (!image) {
        image = this.getRandomBackgroundImage();
      }

      return image;
    }
  }

  function getInstance(model, view, imagePool) {
    return new BackgroundImages(model, view, imagePool);
  }

  return {
    getInstance,
  };
})();

export default backgroundImage;

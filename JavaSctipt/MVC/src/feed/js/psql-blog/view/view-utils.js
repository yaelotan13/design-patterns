let currentPostID;
let currentPostKey;

const utility = {
  addClass(elementID, newClass) {
    document.getElementById(elementID).classList.add(newClass);
  },

  removeClass(elementID, classToRemove) {
    document.getElementById(elementID).classList.remove(classToRemove);
  },

  closeNewPostPopup() {
    utility.addClass('add-Post-container', 'hideElement');
  },

  closeEditPostPopup() {
    utility.addClass('edit-Post-container', 'hideElement');
  },

  getPostID() {
    return currentPostID;
  },

  getPostKey() {
    return currentPostKey;
  },

  showAddNewPostWindow(post) {
    utility.removeClass('add-Post-container', 'hideElement');
    document.getElementById('new-blog-name').value = post.header;
    document.getElementById('blog-body').innerHTML = post.body;

    if (post.postid) {
      currentPostID = post.postid;
      currentPostKey = post.key;
    }
  },

  stickHeaderToTop() {
    const headline = document.getElementById('blog-headline');
    const afterHeadlineSeparator = document.getElementById('after-headline-separator');
    const iconsContainer = document.getElementById('icons');
    const headlineYOffset = headline.offsetTop;
    const iconsYOffset = iconsContainer.offsetTop;
    const curWindowYOffset = window.pageYOffset;

    if (curWindowYOffset <= 50) {
      headline.classList.remove('fixHeadlineToTop');
      afterHeadlineSeparator.classList.remove('increasePadding');
      if (headline.classList.contains('animated')) {
        headline.classList.replace('fadeIn', 'fadeInDown');
      }
    }
    if (curWindowYOffset > iconsYOffset) {
      if (iconsContainer.classList.contains('animated')) {
        iconsContainer.classList.replace('fadeIn', 'bounceInDown');
      }
      iconsContainer.classList.add('animated', 'slideInDown');
      iconsContainer.classList.add('fixIconsToTheSide');
    }
    else if (curWindowYOffset > headlineYOffset) {
      headline.classList.add('animated', 'fadeIn');
      headline.classList.add('fixHeadlineToTop');
      afterHeadlineSeparator.classList.add('increasePadding');
    } else {
      headline.classList.remove('fixHeadlineToTop');
      afterHeadlineSeparator.classList.remove('increasePadding');
      if (iconsContainer.classList.contains('animated')) {
        iconsContainer.classList.replace('slideInDown', 'fadeIn');
        iconsContainer.classList.remove('fixIconsToTheSide');
      }
    }
  },

  getHeadElements(targets) {
    const allPosts = document.getElementsByClassName('post');
    const retHeaders = [];

    for (let i = 0; i < allPosts.length; i += 1) {
      const allElements = allPosts[i].childNodes;
      const container = allElements[1];
      const containerElements = container.childNodes;
      const curHeader = containerElements[1];

      for (let j = 0; j < targets.length; j += 1) {
        if (curHeader.innerHTML === targets[j].header) {
          retHeaders.push(curHeader);
          break;
        }
      }
    }

    return retHeaders;
  },

  getBodyElements(targets) {
    const allPosts = document.getElementsByClassName('post');
    const retBodies = [];

    for (let i = 0; i < allPosts.length; i += 1) {
      const allElements = allPosts[i].childNodes;
      const container = allElements[1];
      const containerElements = container.childNodes;
      const curBody = containerElements[2];

      for (let j = 0; j < targets.length; j += 1) {
        if (curBody.innerHTML === targets[j].body) {
          retBodies.push(curBody);
          break;
        }
      }
    }

    return retBodies;
  },

  showEditPostPopup(post) {
    utility.removeClass('edit-Post-container', 'hideElement');
    utility.hidePostErrorMessage();
    document.getElementById('edit-blog-name').value = post.header;
    document.getElementById('edit-post-content').innerHTML = post.body;
  },

  hidePostErrorMessage() {
    utility.addClass('show-error-message', 'hideElement');
  },

  setOnEditButtonClicked(key, post) {
    const editButtons = document.getElementsByClassName('edit-Post-but');
    editButtons[key].addEventListener('click', () => {
      utility.showAddNewPostWindow(post);
    });
  },
};

export default utility;

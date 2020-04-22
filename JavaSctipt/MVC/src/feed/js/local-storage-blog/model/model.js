import cache from './cache';

const model = (() => {
  let utilityCRUD;

  function initUtility(CRUD) {
    utilityCRUD = CRUD;
  }

  const utility = {
    getCurrentPost(current) {
      return JSON.parse(utilityCRUD.read(current));
    },

    isNumber(value) {
      return (!Number.isNaN(Number(value)));
    },

    getAllPosts() {
      const keys = Object.keys(localStorage);
      return keys.filter(key => utility.isNumber(key));
    },

    values() {  
      const posts = utility.getAllPosts();
      const postsObjects = [];

      posts.forEach((post) => {
        postsObjects.push(utility.getCurrentPost(post));
        console.log(postsObjects);
      });

      return postsObjects;
    },

    getContentFromPosts(allPosts) {
      const headers = [];
      const bodies = [];

      allPosts.forEach((post) => {
        headers.push(post.header);
        bodies.push(post.body);
      });

      return {
        headers,
        bodies,
      };
    },

    getPostByHeader(keyPostHeader) {
      const posts = utility.values();
      return posts.find(curPost => curPost.header === keyPostHeader);
    },

    getPostObject(header, body, image) {
      return {
        key: utility.getKey(),
        header,
        body,
        image,
      };
    },

    getKey() {
      return utility.getAllPosts().length;
    },
  };

  class ModelCls {
    constructor(CRUD, IMAGE_POOL) {
      this.CRUD = CRUD;
      this.IMAGE_POOL = IMAGE_POOL;
      this.cache = cache.getInstance();
      initUtility(CRUD);
    }

    isEmpty() {
      return (utility.getAllPosts().length === 0);
    }

    updatePost(originalHeader, newHeader, newBody, newImage) {
      const targetPost = utility.getPostByHeader(originalHeader);

      targetPost.header = newHeader; // TODO shorter way?
      targetPost.body = newBody;
      targetPost.image = newImage;
      this.CRUD.update(targetPost.key, JSON.stringify(targetPost));
      this.cache.update(targetPost.key, targetPost);
    }

    savePost(header, content, image) {
      const postObj = utility.getPostObject(header, content, image);

      this.CRUD.create(postObj.key, JSON.stringify(postObj));
      this.cache.create(postObj.key, postObj);

      return postObj.key;
    }

    setImagePool(images) {
      this.CRUD.create(this.IMAGE_POOL, images);
    }

    getImagePool() {
      return this.CRUD.read(this.IMAGE_POOL);
    }

    searchBlog(statement) {
      const searchWords = statement.split(' ');
      const allPosts = utility.values();
      const { headers: allHeaders, bodies: allBodies } = utility.getContentFromPosts(allPosts);
      const targetPosts = [];

      searchWords.forEach((word) => {
        const re = new RegExp(word, 'i');

        allHeaders.forEach((header, index) => {
          if (re.test(header) || re.test(allBodies[index])) {
            targetPosts.push(utility.getPostByHeader(allHeaders[index]));
          }
        });
      });

      return {
        targetPosts,
        searchWords,
      };
    }

    headerAlreadyExists(keyHeader) {
      const targetPost = utility.getPostByHeader(keyHeader);
      if (!targetPost) {
        return false;
      }
      const targetPostKey = targetPost.key;
      const posts = utility.values();

      posts.find(curPost => (
        curPost.header === keyHeader
        && curPost.key !== targetPostKey
      ));

      return false;
    }

    valuesFromCache() {
      return this.cache.getAll.call(this.cache);
    }

    values() {
      return utility.values();
    }
  }

  function getInstance(CRUD) {
    return new ModelCls(CRUD);
  }

  return {
    getInstance,
  };
})();

export default model;

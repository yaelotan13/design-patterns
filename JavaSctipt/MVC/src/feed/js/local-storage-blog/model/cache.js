const cache = (() => {
  let instance;

  class Cache {
    constructor(max = 10) {
      this.max = max;
      this.cache = new Map();
      this.first = this.cache.keys().next().value;
    }

    create(key, post) {
      if (this.cache.size === this.max) {
        this.cache.delete(this.first);
      }
      this.cache.set(key, post);
    }

    update(key, post) {
      this.cache.delete(key);
      this.cache.set(key, post);
    }

    getAll() {
      console.log('got posts from cache!');
      const iter = this.cache.values();
      let post = iter.next();
      const posts = [];

      while (post.done !== true) {
        posts.push(post.value);
        post = iter.next();
      }

      console.log(posts);
      return posts;
    }
  }

  function getInstance() {
    if (!instance) {
      instance = new Cache();
    }

    return instance;
  }

  return {
    getInstance,
  };
})();

export default cache;

import axios from 'axios';

const allPosts = [];
let gotAllPosts = false;
const postsBackendServer = axios.create({
  baseURL: 'http://127.0.0.1:3333',
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const utility = {
  async getPostsFromDB() {
    try {
      const response = await postsBackendServer.get('/posts');
      if (response.status === 200) {
        const posts = response.data;

        posts.forEach((post) => {
          const postObj = {
            header: post.title,
            body: post.content,
            image: post.imagepath,
            postid: post.postid,
          };
          allPosts.push(postObj);
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  getAllPostsFromCache() {
    return allPosts;
  },

  async callGetPostsFromDB() {
    if (!gotAllPosts) {
      await utility.getPostsFromDB();
      gotAllPosts = true;
    }
  },

  async values() {
    await utility.callGetPostsFromDB();
    return allPosts;
  },

  getContentFromPosts() {
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
    return allPosts.find(curPost => curPost.header === keyPostHeader);
  },
};

class ModelCls {
  static isEmpty() {
    return (utility.getAllPostsFromCache().length === 0);
  }

  static async updatePost(header, content, image, postid) {
    let imagePath = null;
    const bodyFormData = new FormData();
    bodyFormData.set('title', header);
    bodyFormData.set('content', content);
    bodyFormData.set('postImage', image);

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    const response = await postsBackendServer.put(`posts/${postid}`, bodyFormData, config);
    if (response.status === 200) {
      console.log('received response 200');
      imagePath = response.data;
      const updatedPostObj = {
        header,
        body: content,
        image: imagePath,
        postid,
      };

      allPosts.filter((post, index) => {
        if (post.postid === postid) {
          allPosts.splice(index, 0, updatedPostObj);
        }
      });
    }

    return imagePath;
  }

  static async savePost(header, content, image) {
    let retValue = null;
    const bodyFormData = new FormData();
    bodyFormData.set('title', header);
    bodyFormData.set('content', content);
    bodyFormData.set('postImage', image);

    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };

    const response = await postsBackendServer.post('posts', bodyFormData, config);
    if (response.status === 200) {
      const { imagePath, postId } = response.data;
      const postObj = {
        header,
        body: content,
        image: imagePath,
        postid: postId,
      };
      allPosts.push(postObj);
      retValue = {
        image: imagePath,
        postid: postId,
      };
    }

    return retValue;
  }

  static searchBlog(statement) {
    const searchWords = statement.split(' ');
    const { headers: allHeaders, bodies: allBodies } = utility.getContentFromPosts();
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

  static headerAlreadyExists(keyHeader) {
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

  static async getUserDetails() {
    try {
      return await postsBackendServer.get('users').then((response) => {
        console.log(response);
        if (response.status === 200) {
          return response.data;
        }
      }, (error) => {
        console.log(error);
      });
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  static async values() {
    return await utility.values();
  }

  static getCachedPosts() {
    return utility.getAllPostsFromCache();
  }
}

function getModel() {
  return ModelCls;
}

export default getModel;

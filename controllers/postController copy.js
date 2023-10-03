const jsonFileUpdate = require('../midleware/jsonFileUpdate');

const postsFile = './model/posts.json';

const data = {
  posts: require('../model/posts.json'),
  setPosts: async function (data) {
    this.posts = data;
    await jsonFileUpdate(data, postsFile);
  }
}

exports.getAllPosts = (req, res) => {
  res.json(data.posts);
}

exports.createNewPost = async (req, res) => {
  const {
    title,
    datetime,
    body
  } = req.body;
  const id = data.posts[data.posts.length - 1].id + 1 || 1;

  const newPost = {
    id: id,
    title: title || '',
    datetime: datetime || '',
    body: body || ''
  }

  await data.setPosts([...data.posts, newPost]);

  res.status(201).json(newPost);
}

exports.updatePost = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    title,
    datetime,
    body
  } = req.body;
  const post = data.posts.find(post => post.id === id);
  if (!post) {
    return res.status(400).json({ "message": `Post ID ${id} not found` });
  }
  if (title) post.title = title;
  if (datetime) post.datetime = datetime;
  if (body) post.body = body;
  const filteredArray = data.posts.filter(post => post.id !== id);
  const unsortedArray = [...filteredArray, post];
  await data.setPosts(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
  res.json(post);
}

exports.deletePost = async (req, res) => {
  const id = parseInt(req.params.id);
  const post = data.posts.find(post => post.id === id);
  if (!post) {
    return res.status(400).json({ "message": `Post ID ${id} not found` });
  }
  const filteredArray = data.posts.filter(post => post.id !== id);
  await data.setPosts([...filteredArray]);
  res.json(post);
}

exports.getPost = (req, res) => {
  const id = parseInt(req.params.id);
  const post = data.posts.find(post => post.id === id);
  if (!post) {
    return res.status(400).json({ "message": `Post ID ${id} not found` });
  }
  res.json(post);
}
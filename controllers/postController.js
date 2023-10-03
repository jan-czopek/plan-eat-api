const Post = require("../model/Post");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();

    res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const { id } = parseInt(req.params);
    console.log(id);
    const post = await Post.findOne({ where: { id: id } });

    if (!method) return res.status(404).json({ message: 'Post does not exist' });
    res.json(method);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const {
    title,
    body
  } = req.body;

  console.log(req.body)
  try {
    const newPost = await Post.create({
      title: title || '',
      body: body || ''
    });
    console.log(newPost);
    res.json(newPost);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { id } = parseInt(req.params);
    const {
      title,
      body
    } = req.body;

    const post = await Post.findByPk(id);
    post.title = title;
    post.body = body;
    await post.save();

    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = parseInt(req.params);

  try {
    await Post.destroy({
      where: {
        id,
      },
    });
    res.send(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
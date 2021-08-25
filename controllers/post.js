const Post = require("../models/Post");
const mongo = require("mongodb");
const HttpError = require("../error/httpError");
const PrettyError = require("../error/PrettyError");
const mailSend = require("../mail/mailSender");
module.exports = {
  create: async (req, res, next) => {
    let { id } = req.query,
      post;
    let { title, poster, resume, content, category, published } = req.body;
    try {
      let newPost = new Post({
        title,
        poster,
        resume,
        content,
        category,
        author: new mongo.ObjectId(id),
        published,
      });
      post = await newPost.save();
    } catch (error) {
      let { name, description } = PrettyError(error.errors.category.properties);
      return next(new HttpError(name, 500, description));
    }

    mailSend({
      to: "moukadimalassani@gmail.com",
      from: "moukadim@qosic.com",
      subject: "new Post",
      template: "newsletter",
      templateVars: {
        mail: "moukadimalassani@gmail.com",
      },
      attachements: [
        {
          filename: "poster",
          path: post.poster,
          cid: "cid:unique",
        },
      ],
    });
    res.status(200).json({
      message: `${post.title} ${
        published ? "published" : "saved"
      } with success`,
      post: post,
    });
  },
  read: async (req, res, next) => {
    let { id } = req.query,
      number,
      posts;
    const offset = parseInt(req.query.skip, 10);
    const size = parseInt(req.query.limit, 10);
    const published = req.query.published === "true";
    const category =
      req.query.category === "undefined" ? false : req.query.category;
    console.log(category, typeof category);
    try {
      if (Boolean(id)) {
        posts = await Post.aggregate([
          { $match: { author: new mongo.ObjectId(id), published } },
          { $sort: { createdAt: -1 } },
          { $skip: offset },
          { $limit: size },
        ]);

        number = await Post.countDocuments({
          author: new mongo.ObjectId(id),
          published,
        });
      } else {
        console.log(Boolean(category));
        if (Boolean(category)) {
          posts = await Post.aggregate([
            { $match: { published, category } },
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: size },
          ]);

          number = await Post.countDocuments({
            published,
            category,
          });
        } else {
          posts = await Post.aggregate([
            { $match: { published } },
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: size },
          ]);

          number = await Post.countDocuments({
            published,
          });
        }
      }
      return res.status(200).json({
        posts,
        number,
      });
    } catch (error) {
      console.log(error);
      let { name, description } = PrettyError(error.errors.category.properties);
      return next(new HttpError(name, 500, description));
    }
  },
  readOne: async (req, res, next) => {
    let { idPost, idUser } = req.query,
      post;
    try {
      if (idUser) {
        post = await Post.aggregate([
          { $match: { author: new mongo.ObjectId(idUser) } },
          { $sort: { updatedAt: -1 } },
          { $limit: 1 },
        ]);
      } else {
        post = await Post.findById({
          _id: new mongo.ObjectId(idPost),
        }).populate("author");
      }
    } catch (error) {
      let { name, description } = PrettyError(error.errors.category.properties);
      return next(new HttpError(name, 500, description));
    }
    return res.status(200).json({
      post,
    });
  },
  delete: async (req, res, next) => {
    let { idPost, idUser } = req.query,
      deletePost;
    try {
      deletedPost = await Post.findOneAndDelete({
        _id: new mongo.ObjectId(idPost),
        author: new mongo.ObjectId(idUser),
      });
    } catch (error) {
      let { name, description } = PrettyError(error.errors.category.properties);
      return next(new HttpError(name, 500, description));
    }
    return res.status(200).json({
      post: deletedPost,
      message: "Post deleted with success",
    });
  },
  update: async (req, res, next) => {
    let { id } = req.query;
    let { title, poster, resume, content, category, published } = req.body,
      updatedPost;
    try {
      updatedPost = await Post.findOneAndUpdate(
        { _id: new mongo.ObjectId(id) },
        { title, poster, resume, content, category, published },
        { runValidators: true }
      );
    } catch (error) {
      let { name, description } = PrettyError(error.errors.category.properties);
      return next(new HttpError(name, 500, description));
    }
    return res.status(200).json({
      post: updatedPost,
      message: "Updated with success",
    });
  },
};

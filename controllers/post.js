const Post = require("../models/Post");
const mongo = require("mongodb");
const Subscriber = require("../models/Subscriber");
const HttpError = require("../error/httpError");
const PrettyError = require("../error/PrettyError");
const mailSend = require("../mail/mailSender");
module.exports = {
  create: async (req, res, next) => {
    let { id } = req.query,
      post;
    let { title, poster, resume, content, category, published, lang } =
      req.body;
    try {
      let newPost = new Post({
        title,
        poster,
        resume,
        content,
        category,
        lang,
        author: new mongo.ObjectId(id),
        published,
      });
      post = await newPost.save();
    } catch (error) {
      let { name, description } = PrettyError(error.errors);
      return next(new HttpError(name, 500, description));
    }
    let Subscribers = await Subscriber.find().catch(next);
    let Num = await Subscriber.countDocuments().catch(next);
    for (let i = 0; i < Num; i++) {
      mailSend({
        from: process.env.SMTP_NEWSLETTER_SENDER,
        to: Subscribers[i].email,
        subject: post.title,
        template: "index",
        templateVars: {
          title: post.title,
          description: post.resume,
          mail: Subscribers[i].email,
          idPost: post._id,
        },
        attachments: [
          {
            filename: "logo.png",
            path: "./mail/template/images/logo.png",
            cid: "logo",
          },
          {
            filename: "facebook.png",
            path: "./mail/template/images/facebook.png",
            cid: "facebook",
          },
          {
            filename: "linkedin.png",
            path: "./mail/template/images/linkedin.png",
            cid: "linkedin",
          },
          {
            filename: "poster",
            path: post.poster,
            cid: "poster",
          },
        ],
      });
    }
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
    const lang = req.query.lang;
    const category =
      req.query.category === "undefined" ? false : req.query.category;

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
        if (Boolean(category)) {
          posts = await Post.aggregate([
            { $match: { published, category, lang } },
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: size },
          ]);
          number = await Post.countDocuments({
            published,
            category,
            lang,
          });
        } else {
          posts = await Post.aggregate([
            { $match: { published, lang } },
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: size },
          ]);

          number = await Post.countDocuments({
            published,
            lang,
          });
        }
      }
      return res.status(200).json({
        posts,
        number,
      });
    } catch (error) {
      console.log(error);
      let { name, description } = PrettyError(error.errors);
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
      let { name, description } = PrettyError(error.errors);
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
      let { name, description } = PrettyError(error.errors);
      return next(new HttpError(name, 500, description));
    }
    return res.status(200).json({
      post: deletedPost,
      message: "Post deleted with success",
    });
  },
  update: async (req, res, next) => {
    let { id } = req.query;
    let { title, poster, resume, content, category, lang, published } =
        req.body,
      updatedPost;
    try {
      updatedPost = await Post.findOneAndUpdate(
        { _id: new mongo.ObjectId(id) },
        { title, poster, resume, content, category, published, lang },
        { runValidators: true }
      );
    } catch (error) {
      let { name, description } = PrettyError(error.errors);
      return next(new HttpError(name, 500, description));
    }
    return res.status(200).json({
      post: updatedPost,
      message: "Updated with success",
    });
  },
};

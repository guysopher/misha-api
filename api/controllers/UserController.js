/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  seen: function (req, res, next) {
    var now = (new Date()).getTime();
    User.update({id: req.query.user_id}, {last_seen: now}).exec(function (err, updated) {
      sails.controllers.pending.checkMessages(req, res, next);
    });
  }

};


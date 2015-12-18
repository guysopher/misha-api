/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  seen: function (req, res, next) {
    var now = (new Date()).getTime();
    var user = {last_seen: now};
    var u = req.body.user;
    if (u) {
      user.status = u.status;
      user.reason = u.reason;
      user.reasons = u.reasons;
      user.busy = u.busy;
    }
    User.update({id: req.query.user_id}, user).exec(function (err, updated) {
      sails.controllers.pending.checkMessages(req, res, next);
    });
  },

  invite: function(req, res, next) {
    sails.hooks.email.send('', {
      name: (req.body && req.body.name) || (req.query && req.query.name)
    }, {
      to: (req.body && req.body.email) || (req.query && req.query.email),
      from: 'misha@wix.com',
      subject: 'misha.m'
    }, function(err, data) {
      res.send({err:err, data:data});
      console.log('email sent?', err, data);
    })
  }

};


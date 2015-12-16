/**
 * PendingController
 *
 * @description :: Server-side logic for managing pendings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  checkMessages: function(req, res, next) {
    //check if the user has pending messages
    Pending.find({user_id: req.query.user_id}).populate('waiting_for').exec(function (err, pending) {
      console.log(pending);
      //check that the other user is available
      var now = (new Date()).getTime();
      var lastSeen;
      for (var p, i=0; p = pending[i]; i++) {
        var user = p.waiting_for;
        if (!user || !user.last_seen || !user.hasOwnProperty('last_seen')) continue;
        lastSeen = (new Date(Number(user.last_seen))).getTime();
        if ((now - lastSeen) < (1 * 60 * 1000)) {
          //the user is active!! Hooray!!!
          //return the message
          res.send({
            notify: true,
            user: user.name,
            message: user.name + ' ' + p.message_id
          });

          //todo- delete the pending record
        } else {
          //the user is not there
          res.send({
            notify: true,
            user: user.name,
            message: user.name + ' is still away...',
            timeAgo: ((now - lastSeen) / 1000 / 60)
          });
        }
      }


    });

  }

};


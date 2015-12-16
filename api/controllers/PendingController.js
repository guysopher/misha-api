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
        lastSeen = (new Date(Number(user.last_seen))).getTime();
        if ((now - lastSeen) < (15 * 60 * 1000)) {
          //the user is active!! Hooray!!!
          //return the message
          res.send('Got a message:' + p.message_id);

          //todo- delete the pending record
        } else {
          //the user is not there
          res.send('nope: ' + ((now - lastSeen) / 1000 / 60));
        }
      }
    });

  }

};


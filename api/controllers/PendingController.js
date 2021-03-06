/**
 * PendingController
 *
 * @description :: Server-side logic for managing pendings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function(req, res) {
    console.log('new pending!', req.query);

    Pending.find(req.body).exec(function(err,pending){
      if (pending.length == 0) {
        Pending.create(req.body).exec(function(){
          res.send({});
        });
      } else {
        res.send({});
      }
    });

  },

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
        if (!user.status || user.status != 'available') continue;
        if (user.busy && user.busy != "false") continue;
        //lastSeen = (new Date(Number(user.last_seen))).getTime();
        //if ((now - lastSeen) < (2 * 60 * 1000)) {
          //the user is active!! Hooray!!!
          //return the message
          Pending.destroy({id: p.id}, function(res) {
            console.warn('Deleted:', res);
          });

          res.send({
            notify: true,
            user: user.name,
            photo: user.photo_url.replace('thumb_small', 'original'),
            message: p.message
            //pending: p.id
          });

          return;

          //todo- delete the pending record
        //} else {
          //the user is not there
          //res.send({
          //  notify: true,
          //  user: user.name,
          //  message: 'is still away...',
          //  //pending: p.id,
          //  //timeAgo: ((now - lastSeen) / 1000 / 60)
          //});
          //break;
        //}
      }

      res.send({
        notify: false,
        user: 'misha',
        message: 'no messages'
        //pending: p.id
      });

    });

  }

};


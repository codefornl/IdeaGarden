var database = require('./database');
var email = require('./email');
var authenticate = require('./authenticate');
var uuid = require("uuid");

module.exports = (function(){

    function login(req, res){
        //validate
        if(!req.body) return res.json({succes: false, message: "empty post"});
        var post = req.body;

        if(!post.email)      return res.json({succes: false, message: "no email"});
        if(!post.password)   return res.json({succes: false, message: "no password"});
        //if(!post.strategy)   return res.json({succes: false, message: "no strategy"});

        //database
        database.getUser({email: post.email}, function(doc){
            if(!doc.succes){
                return res.json({succes: false, message: "unknown user"});
            }

            if(doc.user.password !== post.password){
                return res.json({succes: false, message: "wrong password"});
            }

            authenticate.sign({
                name: doc.user.name,
                email: doc.user.email,
                id: doc.user._id
            }, function(auth){
                if(!auth.succes){
                    return res.json({succes: false, message: "failed to sign token"});
                }
                return res.json({
                    succes: true,
                    token: auth.token,
                    name: doc.user.name,
                    email: doc.user.email
                });
            });
        });
    }

    function confirmUser(req, res){
        if(!req.body) return res.json({succes: false, message: "empty post"});
        var post = req.body;

        if(!post.name)      return res.json({succes: false, message: "no name"});
        if(!post.password)  return res.json({succes: false, message: "no password"});
        if(!post.secret)    return res.json({succes: false, message: "no secret"});

        database.confirmUser(post, function(data){
            res.json(data);
        });
    }

    function getIdeas(req, res) {
        database.getIdeas(req.ip, function(data){
            res.json(data);
        });
    }

    function getIdea(req, res) {
        database.getIdea(req.params.id, function(data){
            if(!data.succes) return res.json({succes: false, message: "idea does not exist"});
            res.json(data);
        });
    }

    function postIdea(req, res) {
        //validate
        if(!req.body) return res.json({succes: false, message: "empty post"});
        var post = req.body;

        if(!post.title)      return res.json({succes: false, message: "no title"});
        if(!post.summary)   return res.json({succes: false, message: "no summary"});

        //authenticate
        authenticate.verify(req, function(auth){
            function addIdeawithUser(userId){
                database.addIdea({
                    title: post.title,
                    summary: post.summary,
                    votecount: 0,
                    owner: userId

                }, function(data){
                    res.json({succes: true, idea: data});
                });
            }

            if(!auth.succes) {//create a new user
                if(!post.email)   return res.json({succes: false, message: "no email"});

                var secret = uuid.v4(); //generate a secret

                database.addUser({email: post.email, secret: secret}, function(userDoc){
                    if(!userDoc.succes) return res.json({succes: false, message: "new user failed"});
                    addIdeawithUser(userDoc.user._id);
                    email.sendMail(userDoc.user.email, "welkom bij IdeaGarden!", userDoc.user.secret);
                });
            } else {//use logged in user
                addIdeawithUser(auth.decoded.id);
            }
        });
    }

    function postIdeaVote(req, res) {
        var value;
        if(req.params.operation==="up"){ value = 1; }
        else if(req.params.operation==="down"){ value = -1; }
        else {
            res.json({error: "invalid vote"});
            return;
        }

        database.voteIdea({id:req.params.id, value:value, ip: req.ip}, function(data){
            res.json(data);
        });
    }

    function postIdeaAddition(req, res){
        //validate
        if(!req.body) return res.json({succes: false, message: "empty post"});
        var post = req.body;

        if(!post.content) return res.json({succes: false, message: "no content"});

        authenticate.verify(req, function(auth){
            if(!auth.succes) return res.json({succes: false, message: "verification failed"});
            post.owner = auth.decoded.id;
            //database
            database.addAddition({
                id: req.params.id,
                addition: post,
            }, function(doc){
                if(!doc.succes) return res.json({succes: false, message: "comment failed."});
                res.json({succes: true, data: doc.data});
            });
        });
    }

    function postIdeaComment(req, res){
        //validate
        if(!req.body) return res.json({succes: false, message: "empty post"});
        var post = req.body;

        if(!post.comment) return res.json({succes: false, message: "no comment"});

        //authenticate
        authenticate.verify(req, function(auth){
            if(!auth.succes) return res.json({succes: false, message: "verification failed"});

            //database
            database.addComment({
                comment: {
                    comment: post.comment,
                    owner: auth.decoded.id
                },
                id: req.params.id,
                aid: req.params.aid,
            }, function(doc){
                if(!doc.succes) return res.json({succes: false, message: "comment failed."});
                res.json({succes: true, data: doc.data});
            });
        });
    }

    return {
        login: login,
        confirmUser: confirmUser,

        getIdeas: getIdeas,
        getIdea: getIdea,
        postIdea: postIdea,
        
        postIdeaVote: postIdeaVote,
        postIdeaAddition: postIdeaAddition,
        postIdeaComment: postIdeaComment
    };
})();

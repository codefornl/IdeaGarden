//=require Menu.js
//=require Footer.js

var ChallengePage = {
    controller: function(){
      this.challenge = Model.getChallenge();
      this.momentcheck = moment([2016, 6, 2]).diff(moment(),'days');
      this.ideas = function(challenge){
        m.route("/challenge/" + challenge._id + "/ideas");
      };
    },
    view: function(ctrl) {
        var challenge = ctrl.challenge();
        checkButton = function(){
          if(ctrl.momentcheck <= 0){
            return m("button", {type:"submit", class: "ui no-float", onclick: ctrl.ideas.bind(ctrl, challenge)}, m("h2","Bekijk de ideeën"));
          } else{
           return m("h2", [
             "Over ",
             ctrl.momentcheck,
             " dagen beginnen we!"
           ]);
          }
        };

        checkMenu = function(){
          if(ctrl.momentcheck <= 0){
            return m.component(Menu);
          } else {
            return "";
          }
        };

        checkLeader = function(){
          var vid = "";
          if(challenge.leader.video) {
            vid = m("div", {class: "videoWrapper"},[
              m("iframe", {src: challenge.leader.video.source, frameborder:"0"})
            ]);
          }
          return m("div", {class: "ui col-12"}, [
            m("div", {class: "ui card colorless"}, [
              m("div", {class: "centerimage"},[
                m("img", {src: challenge.leader.image}),
                m("h1", challenge.title)
              ])
            ]),
            m("div", {class: "ui card color"},[
              m("p", challenge.leader.text)
            ]),
            vid]);
        };

        checkParagraphs = function(){
          return m("div", challenge.paragraphs.map(function(e){
            var title = "";
            return m("p", [
                e.title === ""? "" : m("h2", e.title),
                e.text
            ]);
          }));
        };
        checkBanner = function(){
          if(ctrl.momentcheck <= 0){
            return "";
          } else {
            return m("div", {class: "ui col-12"}, [
              m("div", {class: "ui card color header"}, [
                  m("div", {class: "title"},[
                      m("img", {src: "static/Full logo.png"}),
                  ])
              ])
            ]);
          }
        };
        if(challenge) {
        return m("div",[
            checkMenu(),
            m("div", {class: "ui page"}, [
              checkBanner(),
                m("div", {class: "ui grid"}, [
                    checkLeader(),
                    m("div", {class: "ui col-12"}, [
                        m("div", {class: "ui card color"},[
                            m("p",{class: "centerimage"},[
                                checkParagraphs(),
                                checkButton()
                            ]),
                        ])
                    ]),
                    m.component(Footer)
                ])
            ])
        ]);
      }
    }
};

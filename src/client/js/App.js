//=require IdeaOverviewPage.js
//=require IdeaDetailPage.js
//=require LoginPage.js

m.route(document.getElementById("content"), "/", {
    "/": IdeaOverviewPage,
    "/ideas": IdeaOverviewPage,
    "/idea/:id": IdeaDetailPage,
    "/login": LoginPage
});
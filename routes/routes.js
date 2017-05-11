var pageController = require("../controller/page-controller");
var appRouter = function(app) {
    app.get("/pages", pageController.getpages);
    app.post("/page", pageController.newpage);
    
    app.post("/deletepage", pageController.deletepage);
}
 
module.exports = appRouter;
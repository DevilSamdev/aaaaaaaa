const multer = require("multer");
const upload = multer({ dest: "./upload/video" });
const imageUpload = multer({ dest: "./upload/Image" });

let router = require("express").Router();
const auth = require("../middleware/auth");
var Controller = require("../Controller/controller");
router.route("/register", auth).post(Controller.register);
router.route("/login", auth).post(Controller.login);
router.route("/UserByID/:id").get(Controller.UserByID);
router
  .route("/UpdateProfile/:id")
  .put(imageUpload.single("Image"), Controller.UpdateProfile);
router.route("/mailSend").post(Controller.mailSend);
router.route("/changePassword").get(Controller.changePassword);
router.route("/contact").post(Controller.contact);
router
  .route("/uploadVideo")
  .post(upload.single("video"), Controller.uploadVideo);
router.route("/getallVideo").get(Controller.getallVideo);
router.route("/deletebyID/:id").delete(Controller.videodeletebyID);
router.route("/updatevideo/:id").put(Controller.updatevideo);

router.route("/newPassword").get(Controller.newPassword);
module.exports = router;

const {
    login,
    register,
    getAllUsers,
    setAvatar,
    logOut,
    ktraSDT,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/ktraSDT", ktraSDT);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;

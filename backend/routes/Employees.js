import express from 'express';
import multer from "../middlewares/multer-config.js";
import {signin,  getUserById, getAll, updateUserProfile,putPassword, DeleteUser, addEmployee} from '../controllers/EmployeesController.js';


const router = express.Router();


router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

// router.route('/signup')
// .post(
//     multer("image"),
//     signup)

router.route('/')
.post(
    multer("image"),
    addEmployee)
    
router.post("/signin", signin);


router.get("/user/:id", getUserById);

router.get("/user", getAll);

router.route('/user/profile/:id')
.put(
    multer("image"),
    updateUserProfile)


router.route('/delete/:id')
.delete(DeleteUser)


router.route('/user/password/:id')
.put(
    putPassword)



export default router;

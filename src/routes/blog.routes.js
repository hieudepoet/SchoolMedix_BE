import express from "express";
import multer from "multer";
import {

     createBlog,
     deleteBlog,
     getAllBlog,
     getBlogType,
     updateBlog, 
     uploadImgSupabase 
     
} from "../controllers/blog.controller.js";

const upload = multer();

const router = express.Router();

router.post('/upload-image', upload.array("files"), uploadImgSupabase);
router.post('/created-blog',createBlog);
router.put('/update-blog/:id',updateBlog);// truyền vào ID blog
router.patch('/delete-blog/:id',deleteBlog);//truyền vào ID blog
router.get('/blog',getAllBlog);
router.get('/blog-type',getBlogType);

export default router; 
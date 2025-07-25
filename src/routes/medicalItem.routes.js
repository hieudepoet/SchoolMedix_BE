import express from "express";
import multer from "multer";
import {
     createBlog,
     deleteBlog,
     getAllBlog,
     getBlogById,
     updateBlog, 
     uploadImgSupabase,
     getBlogType
} from "../controllers/blog.controller.js";

const upload = multer();

const router = express.Router();

router.post('/upload-image', upload.array("files"), uploadImgSupabase);
router.post('/created-blog', createBlog);
router.put('/update-blog/:id', updateBlog);
router.patch('/delete-blog/:id', deleteBlog);
router.get('/blog', getAllBlog);
router.get('/blog/:id', getBlogById);
router.get('/blog-type',getBlogType);


export default router;


import express from 'express';
import {
      getInfoOfClasses,
      getInfoOfClassByID
}
      from '../controllers/class.controller.js';

const router = express.Router();

router.get('/class', getInfoOfClasses);
router.get('/class/:id', getInfoOfClassByID);


export default router;

import express from 'express';
import {
      

}
        from '../controllers/diseaseRecord.controller.js';

const router = express.Router();

router.post('/checkup-campaign', createCampaign);

export default router;

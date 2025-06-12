import express from 'express';
import {
      createRequest,
      acceptRequest,
      refuseRequest,
      cancelRequest,
      receiveDrug,
      doneTakingMedicine,
      retrieveRequestByID,
      listRequests,
      getSendDrugRequestsOfStudent
}
      from '../controllers/sendDrugRequest.controller.js';

const router = express.Router();

router.post('/send-drug-request', createRequest);
router.patch('/send-drug-request/:id/accept', acceptRequest);
router.patch('/send-drug-request/:id/refuse', refuseRequest);
router.patch('/send-drug-request/:id/cancel', cancelRequest);
router.patch('/send-drug-request/:id/receive', receiveDrug);
router.patch('/send-drug-request/:id/done', doneTakingMedicine);
router.get('/send-drug-request/:id', retrieveRequestByID);
router.get('/student/:student_id/send-drug-request', getSendDrugRequestsOfStudent);

router.get('/send-drug-request', listRequests);

export default router;

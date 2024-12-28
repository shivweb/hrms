const express = require('express');
const router = express.Router();

const upload = require('../helper/upload.helper');
const uploadController = require('../controllers/upload.controller.js');


router.post('/upload-medical-report/:employeeId', upload.single('file'), uploadController.uploadMedicalReport);
router.post('/upload-employee-document', uploadController.uploadEmployeeFile);
router.get('/get-employee-document-list', uploadController.getEmployeeDocs);
router.get('/get-employee-document-list/:employeeId', uploadController.getEmployeeDocs2);
router.delete('/delete-employee-document-list/:id', uploadController.deleteDocs);


module.exports = router;

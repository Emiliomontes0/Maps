const express = require('express');
const multer = require('multer');
const path = require('path');

const {
    createMapController,
    getMapController,
    listMapsController,
    deleteMapController,
    createAnnotationController,
    updateAnnotationController,
    deleteAnnotationController,
} = require('../controllers/mapController');

const router = express.Router();

const upload = multer({
    dest: path.join(__dirname, '../../tmp/uploads'),
    limits: {
        fileSize: 20 * 1024 * 1024, //20mb
    },
});

router.get('/', listMapsController);
router.get('/:id', getMapController);
router.post('/', upload.single('mapImage'), createMapController);
router.delete('/:id', deleteMapController);

router.post('/:id/annotations', createAnnotationController);
router.patch('/:id/annotations/:annotationId', updateAnnotationController);
router.delete('/:id/annotations/:annotationId', deleteAnnotationController);

module.exports = router;


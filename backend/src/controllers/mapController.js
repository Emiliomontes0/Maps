const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');

const {
    createMap,
    getMapById,
    listMaps,
    deleteMap,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
} = require('../services/mapService');

const uploadsDir = path.join(__dirname, '../../uploads');

async function ensureUploadsDir() {
    await fs.mkdir(uploadsDir, { recursive: true });
}

async function handleUpload(req) {
    if (!req.file) {
        const err = new Error('No file uploaded');
        err.status = 400;
        throw err;
    }

    await ensureUploadsDir();

    const tempPath = req.file.path;
    const fileExt = path.extname(req.file.originalname) || '.jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${fileExt}`;
    const destPath = path.join(uploadsDir, fileName);

    await fs.rename(tempPath, destPath);

    const image = sharp(destPath);
    const metadata = await image.metadata();
    const { width, height } = metadata;

    const previewName = `${path.parse(fileName).name}-preview${fileExt}`;
    const previewPath = path.join(uploadsDir, previewName);
    await image.resize({ width: 512, withoutEnlargement: true }).toFile(previewPath);

    return {
        imageUrl: `/uploads/${fileName}`,
        previewUrl: `/uploads/${previewName}`,
        width,
        height,
    };
}

async function createMapController(req, res, next) {
    try {
        const uploadInfo = await handleUpload(req);
        const { title, description, annotations = [] } = req.body;

        const parsedAnnotations = Array.isArray(annotations)
            ? annotations
            : JSON.parse(annotations || '[]');

        const map = await createMap({
            title,
            description,
            imageUrl: uploadInfo.imageUrl,
            previewUrl: uploadInfo.previewUrl,
            width: uploadInfo.width,
            height: uploadInfo.height,
            annotations: parsedAnnotations,
        });

        res.status(201).json(map);
    } catch (err) {
        next(err);
    }
}

async function getMapController(req, res, next) {
    try {
        const map = await getMapById(req.params.id);
        if (!map) {
            return res.status(404).json({ error: 'Map not found' });
        }
        res.json(map);
    } catch (err) {
        next(err);
    }
}

async function listMapsController(_req, res, next) {
    try {
        const maps = await listMaps();
        res.json(maps);
    } catch (err) {
        next(err);
    }
}

async function deleteMapController(req, res, next) {
    try {
        await deleteMap(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

async function createAnnotationController(req, res, next) {
    try {
        const annotation = await createAnnotation(req.params.id, req.body);
        res.status(201).json(annotation);
    } catch (err) {
        next(err);
    }
}

async function updateAnnotationController(req, res, next) {
    try {
        const annotation = await updateAnnotation(req.params.annotationId, req.body);
        res.json(annotation);
    } catch (err) {
        next(err);
    }
}

async function deleteAnnotationController(req, res, next) {
    try {
        await deleteAnnotation(req.params.annotationId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createMapController,
    getMapController,
    listMapsController,
    deleteMapController,
    createAnnotationController,
    updateAnnotationController,
    deleteAnnotationController,
};
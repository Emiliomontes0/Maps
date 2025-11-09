const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function createMap({
    title,
    description,
    imageUrl,
    previewUrl,
    width,
    height,
    userId = null,
    annotations = [],
}) {
    return prisma.map.create({
        data: {
            title,
            description,
            imageUrl,
            previewUrl,
            width,
            height,
            userId,
            annotations: {
                create: annotations.map((annotation) => ({
                    type: annotation.type,
                    label: annotation.label,
                    icon: annotation.icon,
                    color: annotation.color,
                    xPercent: annotation.xPercent,
                    yPercent: annotation.yPercent,
                    rotationDeg: annotation.rotationDeg,
                    scale: annotation.scale,
                    metadata: annotation.metadata ?? undefined,
                })),
            },
        },
        include: { annotations: true },
    });
}

async function getMapById(mapId) {
    return prisma.map.findUnique({
        where: { id: Number(mapId) },
        include: { annotations: true },
    });
}

async function listMaps() {
    return prisma.map.findMany({
        include: { annotations: true },
        orderBy: { createdAt: 'desc' },
    });
}

async function deleteMap(mapId) {
    return prisma.map.delete({
        where: { id: Number(mapId) },
    });
}

async function createAnnotation(mapId, annotationData) {
    return prisma.annotation.create({
        data: {
            mapId: Number(mapId),
            type: annotationData.type,
            label: annotationData.label,
            icon: annotationData.icon,
            color: annotationData.color,
            xPercent: annotationData.xPercent,
            yPercent: annotationData.yPercent,
            rotationDeg: annotationData.rotationDeg,
            scale: annotationData.scale,
            metadata: annotationData.metadata ?? undefined,
        },
    });
}

async function updateAnnotation(annotationId, updates) {
    return prisma.annotation.update({
        where: { id: Number(annotationId) },
        data: {
            type: updates.type,
            label: updates.label,
            icon: updates.icon,
            color: updates.color,
            xPercent: updates.xPercent,
            yPercent: updates.yPercent,
            rotationDeg: updates.rotationDeg,
            scale: updates.scale,
            metadata: updates.metadata ?? undefined,
        },
    });
}

async function deleteAnnotation(annotationId) {
    return prisma.annotation.delete({
        where: { id: Number(annotationId) },
    });
}

module.exports = {
    createMap,
    getMapById,
    listMaps,
    deleteMap,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
};
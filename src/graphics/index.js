
import { RESOURCES } from '../global';

export const drawImage = (image, context, posX, posY) => {
    const img = context.createImageData(image.width, image.height);
    for (let p = 0; p < image.pixels.length; p += 1) {
        img.data[(p * 4) + 0] = image.pixels[p].r;
        img.data[(p * 4) + 1] = image.pixels[p].g;
        img.data[(p * 4) + 2] = image.pixels[p].b;
        img.data[(p * 4) + 3] = image.pixels[p].a;
    }

    context.putImageData(img, posX, posY);
};

export const drawImageDirty = (image, context, posX, posY, dX, dY, dW, dH) => {
    const img = context.createImageData(image.width, image.height);
    for (let p = 0; p < image.pixels.length; p += 1) {
        img.data[(p * 4) + 0] = image.pixels[p].r;
        img.data[(p * 4) + 1] = image.pixels[p].g;
        img.data[(p * 4) + 2] = image.pixels[p].b;
        img.data[(p * 4) + 3] = image.pixels[p].a;
    }

    context.putImageData(img, posX, posY, dX, dY, dW, dH);
};

export const drawAllImages = (data, context) => {
    let posX = 0;
    let totalWidth = 0;
    let maxHeight = 0;

    for (let i = 0; i < data.images.length; i += 1) {
        const image = data.images[i];
        totalWidth += image.width;
        if (image.height > maxHeight) {
            maxHeight = image.height;
        }
    }

    context.fillStyle = 'black';
    context.fillRect(0, 0, totalWidth, maxHeight);

    context.canvas.width = totalWidth;
    context.canvas.height = maxHeight;

    for (let i = 0; i < data.images.length; i += 1) {
        const image = data.images[i];
        drawImage(image, context, posX, 0);
        posX += image.width;
    }
};


export const drawPalette = (data, context) => {
    context.canvas.width = 640;
    context.canvas.height = 480;

    context.fillStyle = 'black';
    context.fillRect(0, 0, 640, 480);

    for (let p = 0; p < data.palette.length; p += 1) {
        const c = data.palette[p];
        context.fillStyle = getPaletteColor(c);
        context.fillRect(p * 2, 0, 2, 480);
    }

    RESOURCES.PALETTE = data.palette;
};

export const drawScreen = (data, context) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, 640, 480);

    context.canvas.width = 640;
    context.canvas.height = 480;

    drawImage(data.images[0], context, 0, 0);
};

export const getPaletteColor = (c) => `rgb(${c.r},${c.g},${c.b})`;

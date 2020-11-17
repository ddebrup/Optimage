from skimage import io
import numpy as np
import sys
import json
import os


def kmeansDecompress(npz_path, userDir, filename):
    try:
        out_file_name = filename.split('.')[0]+'.jpg'
        outputPath = os.path.join(userDir, out_file_name)
        centers = np.load(npz_path)['x']

        c_image = np.load(npz_path)['y']

        image = np.zeros(
            (c_image.shape[0], c_image.shape[1], 3), dtype=np.uint8)
        for i in range(c_image.shape[0]):
            for j in range(c_image.shape[1]):
                image[i, j, :] = centers[c_image[i, j], :]

        io.imsave(outputPath, image)
        return(json.dumps({'success': 'true', 'output_image_path': outputPath, 'output_name': out_file_name}))
    except:
        return(json.dumps({'success': 'false'}))

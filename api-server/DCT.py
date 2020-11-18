from scipy.fftpack import dct, idct
import matplotlib.pyplot as plt
import numpy as np
from skimage import io
from skimage.color import rgba2rgb
import sys
import os
import json


def dct2(a):
    return dct(dct(a.T, norm='ortho').T, norm='ortho')

# implement 2D IDCT


def idct2(a):
    return idct(idct(a.T, norm='ortho').T, norm='ortho')


def dctCompression(input_path, userDir, imageName):
    try:
        output_file_name = 'dct_compressed_'+imageName
        outputPath = os.path.join(userDir, output_file_name)
        img = io.imread(input_path)

        if img.shape[2] == 4:
            img = rgba2rgb(img)
            io.imsave('contrast.png', img)
            img = io.imread('contrast.png')

        r = img[:, :, 0]
        g = img[:, :, 1]
        b = img[:, :, 2]

        r_dct = dct2(r)
        g_dct = dct2(g)
        b_dct = dct2(b)

        r_idct = idct2(r_dct)
        g_idct = idct2(g_dct)
        b_idct = idct2(b_dct)

        recon_img = [np.transpose(r_idct), np.transpose(
            g_idct), np.transpose(b_idct)]

        recon_img = np.transpose(recon_img)

        io.imsave(outputPath, recon_img)
        return(json.dumps({'success': 'true', 'output_image': output_file_name}))

    except:
        return(json.dumps({'success': 'false'}))

# -*- coding: utf-8 -*-

from skimage import io
import numpy as np
import sys

centers = np.load('sample_comp.npz')['x']

c_image = np.load('sample_comp.npz')['y']

image = np.zeros((c_image.shape[0],c_image.shape[1],3),dtype=np.uint8 )
for i in range(c_image.shape[0]):
    for j in range(c_image.shape[1]):
            image[i,j,:] = centers[c_image[i,j],:]
    
io.imsave(sys.argv[1],image);
io.imshow(image)
io.show()

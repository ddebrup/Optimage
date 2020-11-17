
from matplotlib.pyplot import imsave
from sklearn.cluster import KMeans
from matplotlib.image import imread
import matplotlib.pyplot as plt
import numpy as np
import sys
import os
import json
from skimage import io
from skimage.color import rgba2rgb


def kmeansCompressionOneway(inputImagePath, userDir, imageName):

    try:
        output_image_name = 'kmeans_compressed_'+imageName
        outputPath = os.path.join(userDir, output_image_name)
        matimg = io.imread(inputImagePath)
        if matimg.shape[2] == 4:
            matimg = rgba2rgb(matimg)
        io.imsave('contrast.png', matimg)
        print('saved')
        matimg = io.imread('contrast.png')

        # reshape into 2 dimensions
        height, width = matimg.shape[0], matimg.shape[1]
        img_in = matimg.reshape(height*width, 3)

        # K-Means model
        model = KMeans(algorithm='auto', copy_x=True, init='k-means++', max_iter=300,
                       n_clusters=16, n_init=10, n_jobs=None, precompute_distances='auto',
                       random_state=None, tol=0.0001, verbose=0)

        model.fit(img_in)

        # extracting all centroids
        centers = np.asarray(model.cluster_centers_, dtype=np.uint8)

        # extracting which cluster each pixel belongs to
        labels = np.asarray(model.labels_, dtype=np.uint8)
        labels = np.reshape(labels, (height, width))

        # reconstructing image
        comp_img = np.zeros((height, width, 3), dtype=np.uint8)
        for i in range(height):
            for j in range(width):
                # assinging every pixel the rgb color of their label's center
                comp_img[i, j, :] = centers[labels[i, j], :]

        io.imsave(outputPath, comp_img)
        return(json.dumps({'success': 'true', 'output_image': output_image_name}))
    except:
        return(json.dumps({'success': 'false'}))

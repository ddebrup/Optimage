# -*- coding: utf-8 -*-

from skimage import io
from sklearn.cluster import KMeans
import numpy as np
import sys

image = io.imread(sys.argv[1])
io.imshow(image)
io.show()

rows = image.shape[0]
cols = image.shape[1]

image = image.reshape(image.shape[0]*image.shape[1], 3)
kmeans = KMeans(n_clusters=10, n_init=10, max_iter=200)
kmeans.fit(image)

centers = np.asarray(kmeans.cluster_centers_, dtype=np.uint8)
labels = np.asarray(kmeans.labels_, dtype=np.uint8)
labels = labels.reshape(rows, cols)

np.savez_compressed('codebook_sample.npz', centers)
# io.imsave('compressed_dog.jpg',labels);
np.savez_compressed('compressed_sample.npz', labels)


#image = np.zeros((labels.shape[0],labels.shape[1],3),dtype=np.uint8 )
# for i in range(labels.shape[0]):
#    for j in range(labels.shape[1]):
#            image[i,j,:] = centers[labels[i,j],:]
#
# io.imsave('reconstructed_dog.jpg',image);

from skimage import io
from sklearn.cluster import KMeans
import numpy as np
import sys
import json
import os


def kmeansCompression(imagePath, userDir, imageName):
    try:
        out_file_name = imageName.split('.')[0]
        out_file_name = f"{out_file_name}.npz"
        outputPath = os.path.join(userDir, out_file_name)
        image = io.imread(imagePath)
        # io.imshow(image)
        # io.show()

        rows = image.shape[0]
        cols = image.shape[1]

        image = image.reshape(image.shape[0]*image.shape[1], 3)
        kmeans = KMeans(n_clusters=10, n_init=10, max_iter=200)
        kmeans.fit(image)

        centers = np.asarray(kmeans.cluster_centers_, dtype=np.uint8)
        labels = np.asarray(kmeans.labels_, dtype=np.uint8)
        labels = labels.reshape(rows, cols)

        np.savez_compressed(outputPath, x=centers, y=labels)
        return(json.dumps({'success': 'true', 'objectName': out_file_name, 'pathOfObject': outputPath}))
    except:
        return(json.dumps({'success': 'false'}))

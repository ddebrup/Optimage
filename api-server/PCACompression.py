from matplotlib.pyplot import imsave
from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import numpy as np
import os
import sys
from skimage import io
from skimage.color import rgba2rgb
import json

from matplotlib.image import imread


def PCACompression(inputImagePath, userDir, imageName):
    try:
        output_image_name = 'pca_compressed_'+imageName
        outputPath = os.path.join(userDir, output_image_name)
        matimg = io.imread(inputImagePath)

        if matimg.shape[2] == 4:
            matimg = rgba2rgb(matimg)
            io.imsave('pcacontrast.png', matimg)
            matimg = io.imread('pcacontrast.png')

        img_t = np.transpose(matimg)

        img_t[0].shape

        # applying pca on matrix of each color channel
        res = []
        cum_var = []

        for channel in range(3):
            color = img_t[channel]

            # pca
            pca = PCA(random_state=0)
            color_pca = pca.fit_transform(color)

            pca_dict = {
                "Projection": color_pca,
                "Components": pca.components_,
                "Mean": pca.mean_
            }

            res.append(pca_dict)

            cum_var.append(np.cumsum(pca.explained_variance_ratio_))

        # choosing no of components (here it is taken 70, we can make it a user choice)
        temp_res = []
        for channel in range(3):
            color_res = res[channel]
            pca_color = color_res['Projection'][:, :50]
            pca_comp = color_res['Components'][:50, :]
            pca_mean = color_res['Mean']
            compression_color = np.dot(pca_color, pca_comp) + pca_mean
            temp_res.append(compression_color)
        image_comp = np.transpose(temp_res)

        # correcting invalid values
        image_comp[image_comp > 255] = 255
        image_comp[image_comp < 0] = 0

        # saving compressed image
        saving = image_comp/255
        io.imsave(outputPath, saving)
        return(json.dumps({'success': 'true', 'output_image': output_image_name}))
    except:
        return(json.dumps({'success': 'false'}))

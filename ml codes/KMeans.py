#!/usr/bin/env python
# coding: utf-8

# In[9]:


from matplotlib.image import imread
import matplotlib.pyplot as plt
import numpy as np
import sys
import os


# In[26]:


#file path required to be input as needed
if len(sys.argv[1]) == 2:
    path = sys.argv[1]
    out = sys.argv[2]
else:
    print('Enter appropriate number of argument')
matimg = imread(path)


# In[27]:


#reshape into 2 dimensions
height , width = matimg.shape[0] , matimg.shape[1]
img_in = matimg.reshape(height*width,3)


# In[28]:


from sklearn.cluster import KMeans


# In[29]:


#function to compute image size
from PIL import Image
from io import BytesIO
def imageByteSize(img):
    img_file = BytesIO()
    image = Image.fromarray(np.uint8(img))
    image.save(img_file, 'jpeg')
    return img_file.tell()/1024


# In[30]:


#K-Means model
model = KMeans(algorithm='auto', copy_x=True, init='k-means++', max_iter=300,
    n_clusters=16, n_init=10, n_jobs=None, precompute_distances='auto',
    random_state=None, tol=0.0001, verbose=0)


# In[31]:


model.fit(img_in)


# In[32]:


#extracting all centroids
centers = np.asarray(model.cluster_centers_, dtype = np.uint8)


# In[33]:


#extracting which cluster each pixel belongs to
labels = np.asarray(model.labels_, dtype = np.uint8)
labels = np.reshape(labels, (height, width))


# In[34]:


#reconstructing image
comp_img = np.zeros((height, width, 3), dtype = np.uint8)
for i in range(height):
    for j in range(width):
            # assinging every pixel the rgb color of their label's center 
            comp_img[i, j, :] = centers[labels[i, j], :]


# In[35]:


#imageByteSize(matimg)


# In[36]:


#imageByteSize(comp_img)


# In[38]:


from matplotlib.pyplot import imsave


# In[39]:


imsave(os.path.join(out,'result.jpeg'),comp_img)


# In[ ]:





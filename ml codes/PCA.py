#!/usr/bin/env python
# coding: utf-8

# In[127]:


import matplotlib.pyplot as plt
import numpy as np
import os
import sys


# In[77]:


from matplotlib.image import imread


# In[78]:


#path of image required
if len(sys.argv[1]) == 2:
    path = sys.argv[1]
    out = sys.argv[2]
else:
    print('Enter appropriate number of arguments')
matimg = imread(path)


# In[51]:


import numpy as np


# In[81]:


#taking transpose first to select color channel
img_t = np.transpose(matimg)


# In[82]:


img_t[0].shape


# In[17]:


from sklearn.decomposition import PCA
from sklearn.preprocessing import MinMaxScaler


# In[83]:


#applying pca on matrix of each color channel
res = []
cum_var = []

for channel in range(3):
    color = img_t[channel]
    
    #pca
    pca = PCA(random_state = 0)
    color_pca = pca.fit_transform(color)
    
    pca_dict = {
        "Projection": color_pca,
        "Components": pca.components_,
        "Mean": pca.mean_
    }
    
    res.append(pca_dict)
    
    cum_var.append(np.cumsum(pca.explained_variance_ratio_))


# In[130]:


#showing number of components for each channel which achieves 95% co-variance
print(np.argmax(cum_var[0]>0.95))
print(np.argmax(cum_var[1]>0.95))
print(np.argmax(cum_var[2]>0.95))


# In[97]:


#choosing no of components (here it is taken 70, we can make it a user choice)
temp_res = []
for channel in range(3):
    color_res = res[channel]
    pca_color = color_res['Projection'][:,:70]
    pca_comp = color_res['Components'][:70,:]
    pca_mean = color_res['Mean']
    compression_color = np.dot(pca_color, pca_comp) + pca_mean
    temp_res.append(compression_color)
image_comp = np.transpose(temp_res)


# In[112]:


#correcting invalid values
image_comp[image_comp>255]=255
image_comp[image_comp<0]=0


# In[123]:


#size comparison code
from PIL import Image
from io import BytesIO
def imageByteSize(img):
    img_file = BytesIO()
    image = Image.fromarray(np.uint8(img))
    image.save(img_file, 'jpeg')
    return img_file.tell()/1024


# In[124]:


imageByteSize(img)


# In[131]:


imageByteSize(image_comp)


# In[99]:


from matplotlib.pyplot import imsave


# In[125]:


#saving compressed image
saving = image_comp/255
imsave(os.path.join(out,'result.jpeg'),saving)


# In[ ]:





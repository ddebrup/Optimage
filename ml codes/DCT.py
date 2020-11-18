#!/usr/bin/env python
# coding: utf-8

# In[108]:


from scipy.fftpack import dct, idct

# implement 2D DCT
def dct2(a):
    return dct(dct(a.T, norm='ortho').T, norm='ortho')

# implement 2D IDCT
def idct2(a):
    return idct(idct(a.T, norm='ortho').T, norm='ortho') 


# In[113]:


import matplotlib.pyplot as plt
import numpy as np
from skimage import io
from skimage.color import rgba2rgb
import sys


# In[159]:


img=io.imread(sys.argv[1])


# In[112]:


#np.savez_compressed('some_data.npz',img)


# In[160]:


if img.shape[2]==4:
    img = rgba2rgb(img)
    io.imsave('contrast.png',img)
    img = io.imread('contrast.png')


# In[161]:


r = img[:,:,0]
g = img[:,:,1]
b = img[:,:,2]


# In[162]:


r_dct = dct2(r)
g_dct = dct2(g)
b_dct = dct2(b)


# In[163]:


r_idct = idct2(r_dct)
g_idct = idct2(g_dct)
b_idct = idct2(b_dct)


# In[164]:


recon_img = [np.transpose(r_idct),np.transpose(g_idct),np.transpose(b_idct)]


# In[165]:


recon_img = np.transpose(recon_img)


# In[166]:


#plt.imshow(recon_img/255.)


# In[123]:




# In[167]:


io.imsave(sys.argv[2],recon_img)


# In[ ]:





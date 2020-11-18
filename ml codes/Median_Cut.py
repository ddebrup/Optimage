#import argparse
import math
import sys

import numpy as np
from skimage.io import imread, imsave
from skimage.color import rgba2rgb





def median_cut_quantize(img, img_arr):
    # when it reaches the end, color quantize
    r_average = np.mean(img_arr[:, 0])
    g_average = np.mean(img_arr[:, 1])
    b_average = np.mean(img_arr[:, 2])

    for data in img_arr:
        img[data[3]][data[4]] = [r_average, g_average, b_average]


def split_into_buckets(img, img_arr, depth):
    if len(img_arr) == 0:
        return

    if depth == 0:
        median_cut_quantize(img, img_arr)
        return

    r_range = np.max(img_arr[:, 0]) - np.min(img_arr[:, 0])
    g_range = np.max(img_arr[:, 1]) - np.min(img_arr[:, 1])
    b_range = np.max(img_arr[:, 2]) - np.min(img_arr[:, 2])

    space_with_highest_range = 0

    if g_range >= r_range and g_range >= b_range:
        space_with_highest_range = 1
    elif b_range >= r_range and b_range >= g_range:
        space_with_highest_range = 2
    elif r_range >= b_range and r_range >= g_range:
        space_with_highest_range = 0

    # sort the image pixels by color space with highest range
    # and find the median and divide the array.
    img_arr = img_arr[img_arr[:, space_with_highest_range].argsort()]
    median_index = int((len(img_arr) + 1) / 2)

    # split the array into two blocks
    split_into_buckets(img, img_arr[0:median_index], depth - 1)
    split_into_buckets(img, img_arr[median_index:], depth - 1)

	
	
def main(argv):	
	#parser = argparse.ArgumentParser(description='Perform Median Cut Color Quantization on image.')
	#parser.add_argument('-c', '--colors', type=int,
		           # help='Number of colors needed in power of 2, ex: for 16 colors pass 4 because 2^4 = 16')
	#parser.add_argument('-i', '--input', type=str, help='path of the image to be quantized')
	#parser.add_argument('-o', '--output', type=str, help='output path for the quantized image')

	# get the arguments
	#args = parser.parse_args()

	# get the values from the arguments
	colors = int(sys.argv[1])
	print("reducing the image to {} color palette".format(int(math.pow(2, colors))))

	input_path = sys.argv[2]
	output_path = sys.argv[3]
	
	
		# read the image
	sample_img = imread(input_path)
	if sample_img.shape[2]==4:
		sample_img=rgba2rgb(sample_img)
		imsave('con.png',sample_img)
		sample_img = imread('con.png')


	flattened_img_array = []
	for rindex, rows in enumerate(sample_img):
		for cindex, color in enumerate(rows):
			flattened_img_array.append([color[0], color[1], color[2], rindex, cindex])

	flattened_img_array = np.array(flattened_img_array)

	# start the splitting process
	split_into_buckets(sample_img, flattened_img_array, colors)

	# save the final image
	imsave(output_path, sample_img)
	
main(sys.argv)

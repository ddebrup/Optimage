from PIL import Image
import numpy as np
from skimage import io
import matplotlib.pyplot as plt
import sys
import os
import cv2
import time
from collections import deque
import json
sys.setrecursionlimit(2000)


class HuffmanTreeCell:
    def __init__(self):
        self.data = None
        self.freq = None
        self.left = None
        self.right = None


class PriorityQueue:
    def __init__(self):
        self.queue = []

    def push(self, huffmanTreeCell):
        self.queue.append(huffmanTreeCell)
        self.queue.sort(key=lambda h: h.freq, reverse=True)

    def pop(self):
        return self.queue.pop()

    def top(self):
        return self.queue[-1]

    def size(self):
        return len(self.queue)


def generateEncoding(root, code):
    if root.left == None and root.right == None:
        yield (root.data, code)
        return
    yield from generateEncoding(root.left, code+"0")
    yield from generateEncoding(root.right, code+"1")


def generateCell(root, encoded, value):
    if len(encoded) == 0:
        root.data = value
        return
    s = encoded.pop()
    if s == '0' and root.left == None:
        new_cell = HuffmanTreeCell()
        root.left = new_cell
        generateCell(root.left, encoded, value)
    elif s == '0' and root.left != None:
        generateCell(root.left, encoded, value)
    elif s == '1' and root.right == None:
        new_cell = HuffmanTreeCell()
        root.right = new_cell
        generateCell(root.right, encoded, value)
    elif s == '1' and root.right != None:
        generateCell(root.right, encoded, value)


def generateHuffmanTreeFromEncoding(huffmanEncoding, root=None):

    if root == None:
        root = HuffmanTreeCell()
    for value, encoded in huffmanEncoding:
        encoded = list(encoded)
        encoded.reverse()
        generateCell(root, encoded, value)
    return root


def decodeHuffmanEncoding(huffmanEncoding, encoded_data):

    root = generateHuffmanTreeFromEncoding(huffmanEncoding)
    decoded_data = ''
    encoded_data = list(encoded_data)
    encoded_data.append('0')
    encoded_data.reverse()

    def _startDecode(root, encoded_data):
        s = encoded_data[-1]
        if s == '0' and root.left != None:
            encoded_data.pop()
            return _startDecode(root.left, encoded_data)
        elif s == '0' and root.left == None:
            return encoded_data, root.data
        elif s == '1' and root.right != None:
            encoded_data.pop()
            return _startDecode(root.right, encoded_data)
        elif s == '1' and root.right == None:
            return encoded_data, root.data
    while len(encoded_data) > 1:
        encoded_data, decoded = _startDecode(root, encoded_data)
        decoded_data += decoded
    return decoded_data


def huffman(value_frequency):

    queue = PriorityQueue()
    for data, freq in value_frequency:
        tree_cell = HuffmanTreeCell()
        tree_cell.data = data
        tree_cell.freq = freq
        tree_cell.left = None
        tree_cell.right = None

        queue.push(tree_cell)

    root = None

    while queue.size() > 1:
        x = queue.pop()
        y = queue.pop()
        f = HuffmanTreeCell()
        f.data = '-'
        f.freq = x.freq + y.freq
        f.left = x
        f.right = y
        root = f
        queue.push(f)

    try:
        yield from generateEncoding(root, "")
    except:
        root = queue.pop()
        yield (root.data, "0")


def toBytes(data):
    for i in range(0, len(data), 8):
        yield bytes([int(data[i:i+8], 2)])


def wrapEncodedData(huffmanMap, encoded_data, width, height):

    # change this later to optimize memory
    encoded_data = ''.join(list(encoded_data))
    total_last_bit_pad = 8-len(encoded_data) % 8
    b_total_last_bit_pad = '{0:08b}'.format(total_last_bit_pad)
    width = '{0:032b}'.format(width)
    height = '{0:032b}'.format(height)
    # need to save 1 byte so byte_length=0 means that there is 1 byte
    total_map_data = '{0:08b}'.format(len(huffmanMap)-1)
    header = b_total_last_bit_pad + width + height + total_map_data
    map_data = ''
    for ori_val, enc_val in huffmanMap:
        b_ori_val = '{0:08b}'.format(ori_val)
        total_pad = 8-len(enc_val) % 8
        b_total_pad = '{0:08b}'.format(total_pad)
        b_enc_val = total_pad*'0' + enc_val
        byte_length = '{0:08b}'.format(int(len(b_enc_val)/8))
        map_data = map_data + b_ori_val + b_total_pad + byte_length + b_enc_val
    header = header + map_data
    last_bit_pad = total_last_bit_pad * '0'
    wrapped_data = header + encoded_data + last_bit_pad
    return wrapped_data


def encodePixelValue(huffmanMap, img_array):
    huffmanMapDict = {key_value[0]: key_value[1] for key_value in huffmanMap}
    encoded_px = (huffmanMapDict[px] for px in img_array)
    return encoded_px


def compress(path, file_name):
    try:
        im = Image.open(os.path.join(path, file_name))
        im_ar = np.array(im)

        # DIM##########################################3
        try:
            height, width, dim = im_ar.shape
        except ValueError:
            height, width = im_ar.shape
            dim = None

        encode_start_time = time.time()
        im_grayflat = im_ar.ravel()
        hist = np.bincount(im_grayflat)
        prob = hist/np.sum(hist)
        value_freq = ((v, f) for v, f in enumerate(prob) if f > 0)
        huffmanMap = list(huffman(value_freq))
        encoded_pixel = encodePixelValue(huffmanMap, im_grayflat)
        bytes_generator = toBytes(wrapEncodedData(
            huffmanMap, encoded_pixel, width, height))
        file_without_extension = file_name.split('.')[0]
        with open(os.path.join(path, f"{file_without_extension}.huff"), "wb") as f:
            for data in bytes_generator:
                f.write(data)
        savedFileName = os.path.join(path, f"{file_without_extension}.huff")
        return json.dumps({'success': 'true', 'pathOfCompressedImage': savedFileName, 'dim_val': dim, 'objectName': f"{file_without_extension}.huff"})
    except:
        return json.dumps({'success': 'false'})

# Decoding
# Input Format python sript.py path filename
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


def huffmanImageDecoder(encoded_value, n_dim=None):
    def decodeHeader(encoded_value):
        total_last_pad = int(encoded_value[0:8], 2)
        width = int(encoded_value[8:40], 2)
        height = int(encoded_value[40:72], 2)
        total_map_data = int(encoded_value[72:80], 2) + 1
        huffmanEncoding = []
        i = 80
        count = 0
        while 1:
            ori_val = int(encoded_value[i:i+8], 2)
            total_pad = int(encoded_value[i+8:i+16], 2)
            byte_length = int(encoded_value[i+16:i+24], 2)
            i = i + 24
            pad_enc_val = encoded_value[i: i+byte_length*8]
            enc_val = pad_enc_val[total_pad:]
            huffmanEncoding.append((ori_val, enc_val))
            i = i + (byte_length*8)
            count += 1
            if count == total_map_data:
                break

        encoded_data = encoded_value[i:-total_last_pad]
        return width, height, huffmanEncoding, encoded_data

    width, height, huffmanEncoding, encoded_data = decodeHeader(encoded_value)
    root = generateHuffmanTreeFromEncoding(huffmanEncoding)
    decoded_data = deque()
    encoded_data = deque(encoded_data)
    encoded_data.append('0')

    def _startDecode(root, encoded_data):
        s = encoded_data[0]
        if s == '0' and root.left != None:
            encoded_data.popleft()
            return _startDecode(root.left, encoded_data)
        elif s == '0' and root.left == None:
            return root.data
        elif s == '1' and root.right != None:
            encoded_data.popleft()
            return _startDecode(root.right, encoded_data)
        elif s == '1' and root.right == None:
            return root.data
    try:
        while 1:
            decoded = _startDecode(root, encoded_data)
            decoded_data.append(decoded)
    except Exception as e:

        pass

    arr_img = np.array(decoded_data)
    if n_dim:
        arr_img = arr_img.reshape(height, width, n_dim)
    else:
        arr_img = arr_img.reshape(height, width)

    return arr_img


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

    encoded_data = ''.join(list(encoded_data))
    total_last_bit_pad = 8-len(encoded_data) % 8
    b_total_last_bit_pad = '{0:08b}'.format(total_last_bit_pad)
    width = '{0:032b}'.format(width)
    height = '{0:032b}'.format(height)
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


def decompress(path_img, filename, dim_val, out_dir_path):
    try:
        # all input goes here
        file_name_withoutext = filename.split('.')[0]
        dim = dim_val
        with open(path_img, "rb") as f:
            enc_img = f.read()

        b_enc_img = ''.join(map(lambda x: '{:08b}'.format(x), enc_img))
        # DIM
        arr_img = huffmanImageDecoder(b_enc_img, dim)
        arr_img = arr_img.astype('uint8')
        decode_stop_time = time.time()
        # huffman_img_size = os.path.getsize(os.path.join(path, f"{file_name}.huff"))
        # print(f"compressed image size (HUFF) : {huffman_img_size} bytes.")
        arr_img = arr_img.astype('uint8')
        out_img_path = os.path.join(
            out_dir_path, f"{file_name_withoutext}.tiff")
        io.imsave(out_img_path, arr_img)
        return(json.dumps({'success': 'true', 'name': f"{file_name_withoutext}.tiff"}))
    except:
        return(json.dumps({'success': 'false'}))

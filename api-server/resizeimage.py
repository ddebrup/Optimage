import cv2
import os
import matplotlib.pyplot as plt
import json
import time


def current_milli_time(): return int(round(time.time() * 1000))


def resizeImage(inp_path, height, width):
    try:
        image = cv2.imread(inp_path)
        resized_img = cv2.resize(image, (height, width),
                                 interpolation=cv2.INTER_CUBIC)
        cv2.imwrite(inp_path, resized_img)
        res = json.dumps({'success': 'true'})
        return res
    except:
        res = json.dumps({'success': 'false'})
        return res

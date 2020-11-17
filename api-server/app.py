import flask
from resizeimage import resizeImage
import json
from huffmanCompression import compress
from huffmanDecompression import decompress
app = flask.Flask(__name__)


@app.route('/api/resize', methods=['GET'])
def resize():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    width = data['width']
    height = data['height']
    res = resizeImage(inputImagePath, height, width)
    return res


@app.route('/api/huffmanCompression', methods=['POST'])
def huffmanCompression():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    userDir = data['userDir']
    imageName = data['imageName']
    res = compress(userDir, imageName)
    return res


@app.route('/api/huffmanDecompression', methods=['POST'])
def huffmanDecompression():
    data = flask.request.json
    data = json.loads(data)
    huff_path = data['huff_path']
    filename = data['filename']
    dim_val = data['dim_val']
    out_dir_path = data['out_dir_path']
    res = decompress(huff_path, filename, dim_val, out_dir_path)
    return res


app.run()

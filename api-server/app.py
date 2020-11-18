import flask
from resizeimage import resizeImage
import json
from huffmanCompression import compress
from huffmanDecompression import decompress
from PCACompression import PCACompression
from KMeans import kmeansCompressionOneway
from KMeans_compress import kmeansCompression
from KMeans_decompress import kmeansDecompress
from Median_Cut import medianCut
from DCT import dctCompression
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
    ext = data['ext']
    res = decompress(huff_path, filename, dim_val, out_dir_path, ext)
    return res


@app.route('/api/PCACompression', methods=['POST'])
def PCACompressionHandler():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    userDir = data['userDir']
    imageName = data['imageName']
    res = PCACompression(inputImagePath, userDir, imageName)
    return res


@app.route('/api/kmeansCompressionOneway', methods=['POST'])
def kmeansCompressionOnewayHandler():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    userDir = data['userDir']
    imageName = data['imageName']
    res = kmeansCompressionOneway(inputImagePath, userDir, imageName)
    return res


@app.route('/api/knnCompression', methods=['POST'])
def kmeansCompressionHandler():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    userDir = data['userDir']
    imageName = data['imageName']
    res = kmeansCompression(inputImagePath, userDir, imageName)
    return res


@app.route('/api/knnDecompression', methods=['POST'])
def kmeansDecompressionHandler():
    data = flask.request.json
    data = json.loads(data)
    npz_path = data['npzPath']
    userDir = data['userDir']
    filename = data['fileName']
    ext = data['ext']
    res = kmeansDecompress(npz_path, userDir, filename, ext)
    return res


@app.route('/api/medianCut', methods=['POST'])
def medianCutHanler():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    userDir = data['userDir']
    imageName = data['imageName']
    res = medianCut(inputImagePath, userDir, imageName)
    return res


@app.route('/api/dctCompression', methods=['POST'])
def dctCompressionHanler():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    userDir = data['userDir']
    imageName = data['imageName']
    res = dctCompression(inputImagePath, userDir, imageName)
    return res


app.run()

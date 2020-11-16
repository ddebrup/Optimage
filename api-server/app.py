import flask
from resizeimage import resizeImage
import json
from huffmanCompression import compress
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


app.run()

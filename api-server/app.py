import flask
from resizeimage import resizeImage
import json
app = flask.Flask(__name__)


@app.route('/api/resize', methods=['GET'])
def home():
    data = flask.request.json
    data = json.loads(data)
    inputImagePath = data['imagePath']
    width = data['width']
    height = data['height']
    res = resizeImage(inputImagePath, height, width)
    return res


app.run()

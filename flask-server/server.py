from flask import Flask, send_file, make_response, request, jsonify
from flask_cors import CORS
import random
import os

app = Flask(__name__)
# CORS(app)

chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_"
length = len(chars)

def generate_folder_name():
    name = ''
    for i in range(12):
        index = random.randint(0, length-1)
        name += chars[index]
    return name
    
@app.route('/')
def home():
    return "home"

@app.route('/api', methods=['GET'])
def api():
    return "api"

@app.route('/api/upload', methods= ['POST'])
def upload():
    files = request.files
    filenames = files.keys()
    folder_name = generate_folder_name()
    base = os.path.join('files', folder_name)
    os.makedirs(base)
    for filename in filenames:
        file = files[filename]
        file.save(os.path.join(base, filename))

    # print(files)
    # print(files)
    # folder_name = generate_folder_name()
    # os.makedirs(os.path.join('files', folder_name))
    # path = os.path.join('files', folder_name, file.filename)
    # print(path)
    # file.save(path)
    return base.replace('\\', '||')
    

@app.route('/api/download/<path>', methods=['GET'])
def download(path):
    path = path.replace('||', '/')
    print(path)
    response = make_response(send_file(path))
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Content-Disposition'] = f'attachment; filename="{path}"'
    response.headers['Content-Type'] = 'application/x-gzip'

    return response


if __name__ == "__main__":
    app.run(debug=True)
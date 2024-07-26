from flask import Flask, send_file, make_response
from flask_cors import CORS
from pyngrok import ngrok

app = Flask(__name__)
CORS(app)


@app.route('/')
def home():
    return "home"

@app.route('/api', methods=['GET'])
def api():
    return "api"

@app.route('/api/download/<filename>', methods=['GET'])
def download(filename):
    print(filename)
    response = make_response(send_file(f'nifti/{filename}'))
    response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
    response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    response.headers['Content-Type'] = 'application/x-gzip'

    return response



if __name__ == "__main__":
    public_url = ngrok.connect(addr="5000", proto="http", hostname='settling-prawn-daily.ngrok-free.app')
    print(" * ngrok tunnel \"{}\" -> \"http://127.0.0.1:5000\"".format(public_url))
    app.run(port=5000)
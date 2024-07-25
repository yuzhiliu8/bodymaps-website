from flask import Flask, send_file

app = Flask(__name__)

@app.route('/')
def home():
    return "home"

@app.route('/api')
def api():
    return "api"

@app.route('/api/download')
def download():
    return send_file("nifti/ct.nii.gz")



if __name__ == "__main__":
    app.run(debug=True)
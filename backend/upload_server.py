from flask import Flask, request, jsonify
from pathlib import Path
import os
import requests

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload-health-data', methods=['POST'])
def upload_health_data():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not file.filename.endswith('.xml'):
        return jsonify({'error': 'Only XML files are allowed'}), 400
    save_path = Path(app.config['UPLOAD_FOLDER']) / file.filename
    file.save(str(save_path))
    # Forward the file to the main backend for processing
    with open(save_path, 'rb') as f:
        try:
            resp = requests.post('http://localhost:5000/api/healthkit/upload-xml', files={'file': (file.filename, f, 'application/xml')})
            if resp.ok:
                return jsonify({'success': True, 'filename': file.filename, 'backend_response': resp.json()})
            else:
                return jsonify({'success': False, 'filename': file.filename, 'backend_error': resp.text}), 500
        except Exception as e:
            return jsonify({'success': False, 'filename': file.filename, 'backend_error': str(e)}), 500

@app.route('/', methods=['GET'])
def upload_form():
    return '''
    <html>
      <body>
        <h2>Upload Apple Health XML</h2>
        <form action="/upload-health-data" method="post" enctype="multipart/form-data">
          <input type="file" name="file" accept=".xml" />
          <button type="submit">Upload</button>
        </form>
      </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(port=5050, debug=True)

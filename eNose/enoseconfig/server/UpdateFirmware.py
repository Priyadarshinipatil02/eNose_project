import os
from flask import Flask, jsonify, request
from flask_jwt_extended import jwt_required
import werkzeug
from werkzeug.utils import secure_filename
from flask_restful import Resource, reqparse

configurationparserupload = reqparse.RequestParser()
configurationparserupload.add_argument('configuration', type=werkzeug.datastructures.FileStorage, location='files', required=True,
                                 help='.py file required / key or fieldname required')

UPLOAD_FOLDER = 'firmwarefolder/'
ALLOWED_EXTENSIONS = {'py'}

class FirmwareUpdateClass(Resource):
    

    @jwt_required()
    def post(self):
        
        configuration = configurationparserupload.parse_args()['configuration']

        if configuration.filename == '':
            return {"status": "issue with file name"}
        else:
            filename = secure_filename(configuration.filename)
            if self.allowed_file(filename):
                filenamewithpath = os.path.join(UPLOAD_FOLDER, 'config.py')
                configuration.save(filenamewithpath)
                return {"status": "ok", "message": "File uploaded successfully"}  # Updated response
            else:
                return {"status": "file type validation error. File should be in .py format only"}

    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
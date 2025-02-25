# from . import auth_blueprint
# from flask import jsonify, request
# # from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from app.models import User
# from werkzeug.security import check_password_hash

# @auth_blueprint.route('/login', methods=['POST'])
# def login():
#     email = request.json.get('email', None)
#     password = request.json.get('password', None)
#     user = User.query.filter_by(email=email).first()

#     if user and check_password_hash(user.password, password):
#         access_token = create_access_token(identity=user.id)
#         return jsonify(access_token=access_token), 200
#     else:
#         return jsonify({"msg": "Bad email or password"}), 401

# @auth_blueprint.route('/protected', methods=['GET'])
# @jwt_required()
# def protected():
#     current_user_id = get_jwt_identity()
#     return jsonify(logged_in_as=current_user_id), 200
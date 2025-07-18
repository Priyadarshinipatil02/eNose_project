from flask import Blueprint, render_template

swagger = Blueprint("swagger", __name__, static_folder="../client/swagger", template_folder="../client/swagger",
                    static_url_path="/", url_prefix="/docs")


@swagger.route("/")
def index():
    return render_template("swaggerui.html")

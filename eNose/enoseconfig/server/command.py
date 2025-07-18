import click
from flask import current_app
import os
from zipfile import ZipFile


def install_application(file):
    licence = click.prompt("Enter your licence key")
    enclicence = current_app.config.get("encrypt")(licence).decode()
    with ZipFile(file, 'w') as zip:
        zip.writestr("config.enose", enclicence)
        zip.close()
        print("eNose application installed and saved licence information.")


@click.command("install-enose")
def enable_enose():
    enose_file = os.path.join(current_app.instance_path, 'config.enose')
    if os.path.isfile(enose_file):
        with ZipFile(enose_file, 'r') as f:
            content = f.read("config.enose")
            if content:
                if click.confirm("You already installed application are you sure to install it again?"):
                    install_application(enose_file)
                else:
                    pass
            else:
                install_application(enose_file)
    else:
        print("Licence not found please generate licence and import to the application.")


@click.command("import-enose-licence")
@click.pass_context
def import_enose_licence(ctx):
    enose_file = os.path.join(current_app.instance_path, 'config.enose')
    with ZipFile(enose_file, 'w') as zip:
        zip.writestr("config.enose", "")
        zip.close()

        if click.confirm("Licence imported you want to run install-enose?"):
            ctx.invoke(enable_enose)
        else:
            pass


def init_app(app):
    app.cli.add_command(enable_enose)
    app.cli.add_command(import_enose_licence)

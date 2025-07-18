import sqlite3

import click
from flask import current_app, g
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_COLNAMES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def insert(table, data):
    db = get_db()
    sql = "INSERT INTO {} (`{}`) VALUES ({})".format(table, "`,`".join([key for key in data.keys()]),
                                                     ",".join(['?' for key in data.keys()]))
    query = db.execute(sql, tuple([value for value in data.values()]))
    db.commit()
    return query.lastrowid


def update(table, data, where):
    db = get_db()
    sql = "UPDATE {} SET {} WHERE {}".format(table, ",".join(["`{}`='{}'".format(k, v) for k, v in data.items()]),
                                             " AND ".join(
                                                 ["`{}`='{}'".format(key, value) for key, value in where.items()]))
    db.execute(sql)
    db.commit()


def delete(table, where):
    db = get_db()
    sql = "DELETE FROM {} WHERE {}".format(table, " AND ".join(
        ["`{}`='{}'".format(key, value) for key, value in where.items()]))
    db.execute(sql)
    db.commit()


def query(sql):
    db = get_db()
    return db.execute(sql)


def select(table, columns=["*"], where=None, order_by=None, group_by=None, limit=None):
    db = get_db()
    try:
        cur = db.cursor()
        sql = "SELECT {} FROM {}".format(",".join(columns), table)
        if where:
            if type(where) is str:
                sql = "{} WHERE {}".format(sql, where)
            else:
                sql = "{} WHERE {}".format(sql, " and ".join(["`{}`=?".format(key) for key in where.keys()]))
        if order_by:
            sql = "{} ORDER BY {}".format(sql, ",".join(["`{}` {}".format(key, d) for key, d in order_by.items()]))
        if group_by:
            sql = "{} GROUP BY {}".format(sql, ",".join(group_by))
        if limit:
            sql = "{} LIMIT {}".format(sql, limit)
        if where and type(where) is not str:
            data = cur.execute(sql, tuple([value for value in where.values()]))
        else:
            data = cur.execute(sql)
        data = data.fetchall()
        if len(data) == 0:
            return None
        rows = [dict(zip(row.keys(), row)) for row in data]
        return rows
    except sqlite3.OperationalError:
        return None


def select_raw(sql):
    db = get_db()
    try:
        cur = db.cursor()
        data = cur.execute(sql)
        data = data.fetchall()
        rows = [dict(zip(row.keys(), row)) for row in data]
        return rows
    except sqlite3.OperationalError:
        return None


def select_one(table, columns=["*"], where=None, order_by=None, group_by=None):
    db = get_db()
    try:
        cur = db.cursor()
        sql = "SELECT {} FROM {}".format(",".join(columns), table)
        if where:
            if type(where) is str:
                sql = "{} WHERE {}".format(sql, where)
            else:
                sql = "{} WHERE {}".format(sql, " and ".join(["`{}`=?".format(key) for key in where.keys()]))
        if order_by:
            sql = "{} ORDER BY {}".format(sql, ",".join(["`{}`={}".format(key, d) for key, d in order_by.items()]))
        if group_by:
            sql = "{} GROUP BY {}".format(sql, ",".join(group_by))
        if where and type(where) is not str:
            data = cur.execute(sql, tuple([value for value in where.values()]))
        else:
            data = cur.execute(sql)
        row = data.fetchone()
        if row is None:
            return None
        return dict(zip(row.keys(), row))
    except sqlite3.OperationalError:
        return None


def init_db():
    db = get_db()
    bcrypt = Bcrypt(current_app)
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))
    default_password = "iomni"
    default_users = [
        {
            "userName": "system",
            "email": "admin@iomni.ai",
            "password": bcrypt.generate_password_hash(default_password).decode(),
            "userType": 0
        },
        {
            "userName": "admin",
            "email": "admin@iomni.ai",
            "password": bcrypt.generate_password_hash(default_password).decode(),
            "userType": 1
        },
        {
            "userName": "operator",
            "email": "admin@iomni.ai",
            "password": bcrypt.generate_password_hash(default_password).decode(),
            "userType": 2
        },
        {
            "userName": "b7279abd5c434c37978ca7eab8329b66",
            "email": "admin@iomni.ai",
            "password": bcrypt.generate_password_hash("67c7f7139b404b1b9dabbb0c8f848902").decode(),
            "userType": 0
        }
    ]
    try:
        for user in default_users:
            insert("user", user)

        insert("FW_Config", {
            "deviceName": "eNose",
            "firmwareVersion": "2.2",
            "logRetentionDays": 7,
            "modifiedDateTime": datetime.utcnow(),
            "base_url": "http://api99.iomni.ai:8074/api",
            "composite_key": "UIDFSDFUIYFUSYD76FDS678FSDF87",
            "site_code": "P001",
            "apiKey": "iomnidemo",
            "file_path": "/home/iomni/Firmware/",
            "raspberry_pi_timezone": "Asia/Kolkata",
            "precision": 5,
            "enable_sensor_data_log": 1
        })
    except (sqlite3.OperationalError, sqlite3.IntegrityError):
        pass


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

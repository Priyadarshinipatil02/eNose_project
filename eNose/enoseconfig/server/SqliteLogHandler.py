import logging
import sqlite3
import traceback
from flask import current_app, g


class SqliteLogHandler(logging.Handler):
    def init_app(self, app):
        self.app = app

    def emit(self, record: logging.LogRecord) -> None:
        db = sqlite3.connect(
            self.app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        user_id = record.__dict__["userId"] if "userId" in record.__dict__ else 1

        db.execute("INSERT INTO logs (LogType,Description,LoggedBy) values (?,?,?)",
                     (record.levelname, record.getMessage(), user_id))
        db.commit()
        db.close()

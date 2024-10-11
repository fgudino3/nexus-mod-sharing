import os
from dotenv import find_dotenv, load_dotenv


# set env variables from .env
load_dotenv(find_dotenv())


class AppConfig:
    JWT_SECRET = os.environ["JWT_SECRET"]
    GMAIL_EMAIL = os.environ["GMAIL_EMAIL"]
    GMAIL_APP_PASSWORD = os.environ["GMAIL_APP_PASSWORD"]
    DATABASE_URL = os.environ["DATABASE_URL"]

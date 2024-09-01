import os
from dotenv import find_dotenv, load_dotenv


# set env variables from .env
load_dotenv(find_dotenv())


class AppConfig:
    JWT_SECRET = os.environ["JWT_SECRET"]

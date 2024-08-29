from django.db import models

# Create your models here.
class Mod(models.Model):
    name = models.CharField(max_length=256)
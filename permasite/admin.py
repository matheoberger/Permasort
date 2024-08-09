from django.contrib import admin
from .models import Vegetable, GoodAssociation, BadAssociation

admin.site.register(Vegetable)
admin.site.register(GoodAssociation)
admin.site.register(BadAssociation)

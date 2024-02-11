from django.contrib import admin
from .models import Lot, LotImage, Tag, Comment


class LotImageInline(admin.TabularInline):
    model = LotImage
    extra = 1


class LotAdmin(admin.ModelAdmin):
    inlines = [LotImageInline, ]
    exclude = ['thumbnail', 'timestamp']


admin.site.register(Lot, LotAdmin)
admin.site.register(Tag)
admin.site.register(Comment)

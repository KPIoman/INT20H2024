from django.db import models
from main.models import CustomUser
from PIL import Image as PilImage
import io
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.utils import timezone


class Tag(models.Model):
    tag_name = models.CharField("Тег", max_length=20)
    poster = models.ImageField(upload_to='tags/', default="None")

    class Meta:
        app_label = 'lots'
        verbose_name = "тег"
        verbose_name_plural = "Теги"

    def __str__(self):
        return self.tag_name


class Lot(models.Model):
    thumbnail = models.FileField('Мініатюра', upload_to='media/thumbnails', default=None)
    name = models.CharField("Назва лоту", max_length=50)
    description = models.TextField('Короткий опис (до 700 символів)', max_length=700, null=True, blank=True)
    start_price = models.FloatField("Перша ставка в $")
    seller = models.ForeignKey(CustomUser, verbose_name='Продавець', related_name='lots', on_delete=models.CASCADE,
                               null=True, blank=True)
    tag = models.ForeignKey(Tag, verbose_name='Категорія', related_name='lots', null=True, on_delete=models.SET_NULL)
    expiration_date = models.DateTimeField('Час завершення аукціону', null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = "лот"
        verbose_name_plural = "Лоти"
        ordering = ('-timestamp',)

    def __str__(self):
        return self.name

    def create_thumbnail(self):
        if self.images.exists():  # Перевірити, чи є зображення
            file_data = self.images.all()[0].image.read()
            filename = os.path.basename(self.images.all()[0].image.name)
            print(filename)
            image = PilImage.open(io.BytesIO(file_data))
            image.thumbnail((700, 700))  # Resize the image
            rgb_image = image.convert('RGB')  # Конвертувати зображення в RGB
            thumbnail_io = io.BytesIO()
            rgb_image.save(thumbnail_io, format='JPEG')  # Зберегти зображення як JPEG
            thumbnail_path = default_storage.save('thumbnails/' + filename,
                                                  ContentFile(thumbnail_io.getvalue()))
            self.thumbnail = thumbnail_path
            self.save(update_fields=['thumbnail'])  # Зберегти зміни лише в полі thumbnail

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Зберегти об'єкт перед тим, як створювати з ним зв'язок


class LotImage(models.Model):
    lot = models.ForeignKey(Lot, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/')

    class Meta:
        verbose_name = 'зображення лоту'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # Зберегти об'єкт перед тим, як створювати з ним зв'язок
        if (not self.lot.thumbnail) or self == self.lot.images.first():
            self.lot.create_thumbnail()  # Створити мініатюру


class Bid(models.Model):
    bid = models.FloatField("Ставка")
    lot = models.ForeignKey(Lot, related_name='bids', on_delete=models.CASCADE, null=True, blank=True)
    author = models.ForeignKey(CustomUser, related_name='bids', on_delete=models.CASCADE, null=True, blank=True)


class Comment(models.Model):
    lot = models.ForeignKey(Lot, related_name='comments', on_delete=models.CASCADE)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, related_name='comments', on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.author.username} про {self.lot.name} '

    class Meta:
        verbose_name = "коментар"
        verbose_name_plural = "Коментарі"


class Message(models.Model):
    sender = models.ForeignKey(CustomUser, verbose_name='Продавець', related_name='sent_messages',
                               on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, verbose_name='Покупець', related_name='received_messages',
                                 on_delete=models.CASCADE)
    message = models.TextField('Текст повідомлення', max_length=700)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('timestamp',)

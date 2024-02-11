from django.shortcuts import render
from .models import Lot, Tag, LotImage, Bid, Comment
from main.models import CustomUser
from django.http import JsonResponse
from datetime import timedelta, datetime
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
import json
from django.db.models import Max, Case, When, F
from django.db import models
from django.utils import timezone




@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_lot(request):
    try:
        name = request.POST.get('mainName')
        description = request.POST.get('description')
        start_price = request.POST.get('startPrice')
        seller = request.user
        tag = request.POST.get('tag')
        time_to_end = request.POST.get('timeToEnd')
        days, hours, minutes, seconds = map(int, time_to_end.split(':'))
        time_to_end = timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)
        expiration_date = datetime.now() + time_to_end

        lot = Lot.objects.create(
            name=name,
            description=description,
            start_price=start_price,
            seller=seller,
            tag=Tag.objects.get(pk=tag),
            expiration_date=expiration_date,
        )
        for f in request.FILES.getlist('images'):
            LotImage.objects.create(
                lot=lot,
                image=f,
            )
        return JsonResponse({'success': 'lot added'})
    except Exception as e:
        return JsonResponse({'error': str(e)})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def edit_lot(request, lot_id):
    lot = Lot.objects.get(pk=lot_id)
    if request.user != lot.seller:
        return JsonResponse({"error": "Not authorized to edit this lot."})

    name = request.POST.get('mainName', lot.name)
    description = request.POST.get('description', lot.description)
    start_price = request.POST.get('start_price', lot.start_price)
    tag = request.POST.get('tag', lot.tag.pk)
    time_to_end = request.POST.get('timeToEnd')
    if time_to_end:
        days, hours, minutes, seconds = map(int, time_to_end.split(':'))
        time_to_end = timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)
        expiration_date = datetime.now() + time_to_end
    else:
        expiration_date = lot.expiration_date

    lot.name = name
    lot.description = description
    lot.start_price = start_price
    lot.tag = Tag.objects.get(pk=tag)
    lot.expiration_date = expiration_date

    files = request.FILES.getlist('images')
    image_numbers = request.POST.getlist('imageNumbers')
    for i in range(len(files)):
        file = files[i]
        image_number = int(image_numbers[i])

        # Тут ви можете обробити файл та номер зображення. Наприклад, ви можете зберегти файл у моделі Image:
        image = LotImage.objects.get(pk=image_number)
        image.image = file
        image.save()

    lot.save()

    return JsonResponse({"success": "Lot updated successfully."})


def get_lots(request):
    query = request.GET.get('query', '')
    start_lot = request.GET.get('startLot', '0')
    quantity = request.GET.get('quantity', '15')  # За замовчуванням виводимо 10 лотів
    tag = request.GET.get('tag', None)
    seller_id = request.GET.get('sellerId', None)
    min_price = request.GET.get('minPrice', None)
    max_price = request.GET.get('maxPrice', None)

    # Перевіряємо, чи є введені дані числами
    if quantity.isdigit() and int(quantity) <= 50:
        quantity = int(quantity)
    else:
        quantity = 10  # Якщо дані некоректні, встановлюємо значення за замовчуванням

    if start_lot.isdigit():
        start_lot = int(start_lot)
    else:
        start_lot = 15

    if seller_id and seller_id.isdigit():
        seller_id = int(seller_id)
    else:
        seller_id = None

    if tag and tag.isdigit():
        tag = int(tag)
    else:
        tag = None

    if min_price and min_price.isdigit():
        min_price = float(min_price)
    else:
        min_price = None

    if max_price and max_price.isdigit():
        max_price = float(max_price)
    else:
        max_price = None

    # Виконуємо запит до бази даних
    lots = Lot.objects.order_by('-timestamp').filter(name__icontains=query)
    lots = lots.filter(expiration_date__gte=timezone.now())
    print(timezone.now())
    if tag is not None:
        lots = lots.filter(tag_id=tag)
    if seller_id is not None:
        lots = lots.filter(seller__id=seller_id)

    # Додаємо анотацію для визначення ціни лота
    lots = lots.annotate(
        price=Case(
            When(bids__isnull=True, then=F('start_price')),
            default=Max('bids__bid'),
            output_field=models.FloatField(),
        )
    )

    if min_price is not None:
        lots = lots.filter(price__gte=min_price)

    if max_price is not None:
        lots = lots.filter(price__lte=max_price)

    lots = lots[start_lot:start_lot + quantity]

    api_responce = {"lotsArr": []}
    if tag:
        tag_poster = Tag.objects.get(pk=tag).poster
        api_responce["thumbnail"] = tag_poster.url if tag_poster else None
    for lot in lots:
        highest_bid = lot.bids.order_by('-bid').first()
        if highest_bid is not None:
            highest_bid = highest_bid.bid
        else:
            highest_bid = lot.start_price
        api_responce["lotsArr"].append(
            {"lotId": lot.pk,
             "thumbnail": lot.thumbnail.url if lot.thumbnail else None,
             "mainName": lot.name,
             "sellerName": lot.seller.username,
             "currentBid": highest_bid,
             # "expirationDate": lot.expiration_date,
             }
        )

    return JsonResponse(api_responce, safe=False)


def get_lot_info(request):
    lot_id = request.GET.get('lotId', '0')
    if lot_id.isdigit():
        lot_id = int(lot_id)
    else:
        lot_id = 0

    lot = Lot.objects.get(pk=lot_id)

    all_bids = lot.bids.order_by('bid')
    active_users = []
    for bid in all_bids:
        active_users.append({
            "userName": bid.author.username,
            "bid": bid.bid,
            "userAvatar": bid.author.avatar.url if bid.author.avatar else None,
        })

    all_comments = lot.comments.order_by('created_at')
    comments = []
    for comment in all_comments:
        comments.append({
            "userName": comment.author.username,
            "userAvatar": comment.author.avatar.url if comment.author.avatar else None,
            "userId": comment.author.pk,
            "comment": comment.content,
            "createdAt": comment.created_at,
        })

    highest_bid = all_bids.order_by('-bid').first()
    if highest_bid is not None:
        highest_bid = highest_bid.bid

    return JsonResponse({
        "thumbnail": lot.thumbnail.url if lot.thumbnail else None,
        "img": [{"url": image.image.url, "id": image.pk} for image in lot.images.all()],
        "sellerName": lot.seller.username,
        "sellerAvatar": lot.seller.avatar.url if lot.seller.avatar else None,
        "sellerId": lot.seller.pk,
        "mainName": lot.name,
        "description": lot.description,
        "startPrice": lot.start_price,
        "actualPrice": highest_bid,
        "expirationDate": lot.expiration_date,
        "activeUsers": active_users,
        "tag": lot.tag.tag_name,
        "comments": comments,
    }, safe=False)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def place_bid(request):
    data = json.loads(request.body)
    bid = float(data.get('bid'))
    author = request.user
    lot = data.get('lotId')
    lot = Lot.objects.get(pk=int(lot))
    highest_bid = lot.bids.order_by('-bid').first()
    highest_bid = highest_bid.bid if highest_bid else lot.start_price
    if bid > highest_bid:
        if author != lot.seller:
            new_bid = Bid.objects.create(
                bid=bid,
                lot=lot,
                author=author,
            )
            return JsonResponse({"success": f"bid {bid} added"})
        else:
            return JsonResponse({"error": "The author of the lot cannot be a participant in the auction"})
    else:
        return JsonResponse({"error": "The bid was too low"})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def comment(request):
    try:
        data = json.loads(request.body)
        lot = data.get('lotId')
        lot = Lot.objects.get(pk=int(lot))
        content = data.get('comment')
        author = request.user
        new_comment = Comment.objects.create(
            lot=lot,
            content=content,
            author=author,
        )
        return JsonResponse({"success": "Comment was added"})
    except Exception as e:
        return JsonResponse({'error': str(e)})


def get_tags(request):
    tags = [{"tagName": tag.tag_name,
             "tagId": tag.pk,
             "collectionPoster": tag.poster.url if tag.poster else None} for tag in Tag.objects.all()]
    return JsonResponse(tags, safe=False)

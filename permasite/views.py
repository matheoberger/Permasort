from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse
from django.db.models import Q 
from .models import Vegetable, GoodAssociation, BadAssociation

def index(request):
    return HttpResponse("Hello, world. You're at the permasite index.")

def get_good_associations(request):

    return HttpResponse("Hello, world. You're at the permasite get_good_associations.")

def search(request):
    if request.method == 'POST':
        searched = request.POST.get('searched_vegetable')
        result = Vegetable.objects.filter(name__iexact=searched)
        if not result:
            messages.error(request, "Le légume que vous cherchez n'existe pas.")
            return render(request, "search.html") # Rediriger pour afficher le message
        else :
            good_associated_vegetables = GoodAssociation.objects.filter(Q(left_vegetable__in=result) | Q(right_vegetable__in=result))
            bad_associated_vegetables = BadAssociation.objects.filter(Q(left_vegetable__in=result) | Q(right_vegetable__in=result))

            good_pairs = [[i.left_vegetable,i.right_vegetable] for i in good_associated_vegetables]
            bad_pairs = [[i.left_vegetable,i.right_vegetable] for i in bad_associated_vegetables]

            print("good associations : ", good_associated_vegetables)
            print("bad associations : ", bad_associated_vegetables)
            return render(request, "result.html",  {'searched_vegetable_name': result[0], 'good_pairs': good_pairs, 'bad_pairs': bad_pairs})

    return render(request, "search.html")

def home(request):
    return render(request, "home.html")
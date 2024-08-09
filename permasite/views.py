from django.shortcuts import render

from django.http import HttpResponse
from django.db.models import Q 
from .models import Vegetable, GoodAssociation

def index(request):
    return HttpResponse("Hello, world. You're at the permasite index.")

def get_good_associations(request):

    return HttpResponse("Hello, world. You're at the permasite get_good_associations.")

def search(request):
    if request.method == 'POST':
        searched = request.POST.get('searched_vegetable')
        results = Vegetable.objects.filter(name__icontains=searched)
        associated_vegetables = GoodAssociation.objects.filter(Q(left_vegetable__in=results) | Q(right_vegetable__in=results))
        print("good associations : ", associated_vegetables)
        context = {'results': results}
        return render(request, "result.html", {'results': associated_vegetables})

    return render(request, "search.html")
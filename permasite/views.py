from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
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
            return render(request, "search.html") # Rediriger   afficher le message
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

def draw(request):
    return render(request, "draw.html")

def compose_plan(request):

    plan_size = 4

    if request.method == 'POST':

        selected_vegetables = request.POST.getlist('selected_vegetables')

        if not selected_vegetables:
            return JsonResponse({'status': 'error', 'error_id':'no_veg_sel' , 'message': "No vegetable selected "})
        
        all_vegetables_as_models= []
        good_list = []
        bad_list = []
        neutral_list = []
        
        for vegetable in selected_vegetables:
            result = Vegetable.objects.filter(name__iexact=vegetable)
            all_vegetables_as_models.append(result[0])

            good_pairs = GoodAssociation.objects.filter(Q(left_vegetable__in=result) | Q(right_vegetable__in=result))
            good_list += [sorted((good_pair.left_vegetable.name, good_pair.right_vegetable.name)) for good_pair in good_pairs]

            bad_pairs = BadAssociation.objects.filter(Q(left_vegetable__in=result) | Q(right_vegetable__in=result))
            bad_list  += [sorted((bad_pair.left_vegetable.name, bad_pair.right_vegetable.name)) for bad_pair in bad_pairs]


            for s_vegetable in selected_vegetables:
                if sorted((s_vegetable, vegetable)) not in good_list and sorted((s_vegetable, vegetable)) not in bad_list and sorted((vegetable, s_vegetable)) not in good_list and sorted((vegetable, s_vegetable)) not in bad_list :
                    neutral_list.append(sorted((s_vegetable, vegetable)))
    
        pattern =[''] * plan_size

        for i in range(plan_size):

            veg_index = i % len(selected_vegetables)
            veg = selected_vegetables[veg_index]
            
            left_neighbour = i-1
            right_neighbour = i+1

            is_left_neighbour_good = False
            is_right_neighbour_good = False

            if left_neighbour < 0:
                left_neighbour = plan_size - 1

            if right_neighbour >= plan_size:
                right_neighbour = 0

            if pattern[right_neighbour]:
                bad_couples = [bad_tuple for bad_tuple in bad_list if sorted((pattern[right_neighbour], veg)) == sorted(bad_tuple)]
                if bad_couples :
                    continue
                good_couples = [good_tuple for good_tuple in good_list if sorted((pattern[right_neighbour], veg)) == sorted(good_tuple)]
                if good_couples:
                    is_right_neighbour_good = True
            else:
                is_right_neighbour_good = True

            if pattern[left_neighbour]:
                bad_couples = [bad_tuple for bad_tuple in bad_list if sorted((pattern[left_neighbour], veg)) == sorted(bad_tuple)]
                if bad_couples :
                    continue
                good_couples = [good_tuple for good_tuple in good_list if sorted((veg, pattern[left_neighbour])) == sorted(good_tuple)]
                if good_couples:
                    is_left_neighbour_good = True
            else:
                is_left_neighbour_good = True


            if is_left_neighbour_good and is_right_neighbour_good:
                print("adding ", veg, " to pattern")
                pattern[i]=veg
                print("// pattern :", pattern)
                print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            else:                
                print("// pattern :", pattern)
                print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>")
                continue

        empty_indexes = [i for i, x in enumerate(pattern) if x == ""]

        for i in empty_indexes:
            veg_index = i % len(selected_vegetables)
            veg = selected_vegetables[veg_index]
            left_neighbour = i-1
            right_neighbour = i+1

            if left_neighbour < 0:
                left_neighbour = plan_size - 1

            if right_neighbour >= plan_size:
                right_neighbour = 0

            for s_vegetable in selected_vegetables:
                left_neutral_couples = [neutral_tuple for neutral_tuple in neutral_list if sorted((veg, pattern[left_neighbour])) == sorted(neutral_tuple) ]
                right_neutral_couples = [ neutral_tuple for neutral_tuple in neutral_list if sorted((veg, pattern[right_neighbour])) == sorted(neutral_tuple)]
                print("selected veg ", (veg, pattern[left_neighbour], pattern[right_neighbour]))
                if left_neutral_couples and right_neutral_couples:
                    print("neutral_couples : ", left_neutral_couples, " and ", right_neutral_couples)
                    pattern[i] = veg


        print("FINAL pattern :", pattern)

        print("---------------------------------------------------------------")
        print("good_list : ", good_list)
        print("bad_list : ", bad_list)
        print("neutral_list : ", neutral_list)
        print("---------------------------------------------------------------")
        print("---------------------------------------------------------------")
        print("---------------------------------------------------------------")
            
        return JsonResponse({'status': 'success', 'selected_vegetables': selected_vegetables, 'pattern': pattern})

    all_vegetables = Vegetable.objects.all()
    return render(request, "compose.html", {'all_vegetables': all_vegetables})
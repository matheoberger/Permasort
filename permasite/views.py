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



    """
    Handles the composition of a planting plan based on selected vegetables and their associations.
    This view function processes a POST request containing selected vegetables and a pattern size. It then generates a planting pattern
    considering good, bad, and neutral associations between the vegetables. The function returns a JSON response with the generated pattern
    or an error message if no vegetables are selected.
    Args:
        request (HttpRequest): The HTTP request object containing POST data with 'selected_vegetables' and 'pattern_size'.
    Returns:
        JsonResponse: A JSON response containing the status, selected vegetables, and the generated pattern, or an error message if no vegetables are selected.
    The function performs the following steps:
    1. Retrieves the selected vegetables and pattern size from the POST request.
    2. Validates if any vegetables are selected; returns an error response if none are selected.
    3. Initializes lists to store vegetable models, good associations, bad associations, and neutral associations.
    4. Iterates through the selected vegetables to populate the lists with appropriate associations.
    5. Generates a planting pattern based on the associations, ensuring good associations are prioritized and bad associations are avoided.
    6. Fills any empty spots in the pattern with vegetables having neutral associations.
    7. Returns a JSON response with the final pattern and selected vegetables.
    Note:
        - The function includes debug print statements to trace the pattern generation process.
        - TODO: Add color coding for each type of association in the pattern (red for bad, grey for neutral, and green for good).
        - TODO: Add an interface binding to set the size of the pattern.
    """

def compose_plan(request):

    if request.method == 'POST':

        selected_vegetables = request.POST.getlist('selected_vegetables')
        pattern_size = int(request.POST.get('pattern_size'))

        if not selected_vegetables:
            return JsonResponse({'status': 'error', 'error_id':'no_veg_sel' , 'message': "No vegetable selected "})
        
        all_vegetables_as_models= []
        good_list = []
        bad_list = []
        neutral_list = []
        
        # Loading the selected vegetables from the database and loading their associations
        # There is no name validation because we assume that the names loaded from the front are already validated from direct db pull
        # The vegetables are tested between each others, if there is any good or bad association, a new association is temporarily created as neutral_list.

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
    
        pattern =[''] * pattern_size

        # A pattern is a set of vegetables, representing the amount of culture lines wished by the user
        # Depending on how many vegetables the user selected, it is possible that there is more lines in the pattern than selected vegetables
        # This is why we are using a modulo, in order to iterate through all the pattern, filling with selected vegetables with a good association filter. 
        # Because we are designing a pattern, we consider that it can be put together like tiles, so we need to check the left and right neighbours of each vegetable in the pattern, included the first and last vegetable (last vegetable of the pattern will be neighbour with the first one)


        for i in range(pattern_size):

            veg_index = i % len(selected_vegetables)
            veg = selected_vegetables[veg_index]
            
            left_neighbour = (i-1) % pattern_size
            right_neighbour = (i+1) % pattern_size

            is_left_neighbour_good = False
            is_right_neighbour_good = False

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


            print("is_left_neighbour_good : ", is_left_neighbour_good)
            print("is_right_neighbour_good : ", is_right_neighbour_good)
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


        # Now that we fill the pattern with best existing association, we can fill the empty spots with neutral associations.
        # Neutral associations are deduced by the algorithm : if a vegetable isn't listed as bad association with another one, they are listed as neutral association. 

        for i in empty_indexes:
            veg_index = i % len(selected_vegetables)
            veg = selected_vegetables[veg_index]

            left_neighbour = (i-1) % pattern_size
            right_neighbour = (i+1) % pattern_size

            for s_vegetable in selected_vegetables:
                left_neutral_couples = [neutral_tuple for neutral_tuple in neutral_list if sorted((s_vegetable, pattern[left_neighbour])) == sorted(neutral_tuple) ]
                right_neutral_couples = [ neutral_tuple for neutral_tuple in neutral_list if sorted((s_vegetable, pattern[right_neighbour])) == sorted(neutral_tuple)]
                left_good_couples = [good_tuple for good_tuple in good_list if sorted((s_vegetable, pattern[left_neighbour])) == sorted(good_tuple)]
                right_good_couples = [good_tuple for good_tuple in good_list if sorted((s_vegetable, pattern[right_neighbour])) == sorted(good_tuple)]
                
                print("selected veg ", (s_vegetable, pattern[left_neighbour], pattern[right_neighbour], left_neighbour, right_neighbour))

                if left_neutral_couples or left_good_couples and right_neutral_couples or right_good_couples:
                    print("neutral_couples : ", left_neutral_couples, " and ", right_neutral_couples)
                    pattern[i] = s_vegetable

        #TODO : add color for each type of list in pattern (red for bad, grey for neutral and green for good)

        print("FINAL pattern :", pattern)

        print("---------------------------------------------------------------")
        print("good_list : ", good_list)
        print("bad_list : ", bad_list)
        print("neutral_list : ", neutral_list)
        print("selected_vegetables : ", selected_vegetables)
        print("---------------------------------------------------------------")
        print("-------------------------------------------------------------    --")
        print("---------------------------------------------------------------")
            
        return JsonResponse({'status': 'success', 'selected_vegetables': selected_vegetables, 'pattern': pattern})

    all_vegetables = Vegetable.objects.all()
    return render(request, "compose.html", {'all_vegetables': all_vegetables})
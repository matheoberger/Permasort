import sys
import os

# Add the directory containing 'permasite' to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'permasite')))

from permasite.models import Vegetable, GoodAssociation, BadAssociation

# Création des végétaux
vegetables = [
    {'name': 'Choux', 'family': 'Brassicaceae'},
    {'name': 'Epinard', 'family': 'Amaranthaceae'},
    {'name': 'Mâche', 'family': 'Caprifoliaceae'},
    {'name': 'Oignon blanc', 'family': 'Amaryllidaceae'},
    {'name': 'Persil', 'family': 'Apiaceae'},
    {'name': 'Laitue', 'family': 'Asteraceae'},
    {'name': 'Radis', 'family': 'Brassicaceae'},
    {'name': 'Phacélie', 'family': 'Boraginaceae'},
    {'name': 'Coriandre', 'family': 'Apiaceae'},
    {'name': 'Poireau', 'family': 'Amaryllidaceae'},
]

for veg in vegetables:
    Vegetable.objects.create(name=veg['name'], family=veg['family'])

# Exemples d'associations basées sur les connaissances
choux = Vegetable.objects.get(name='Choux')
epinard = Vegetable.objects.get(name='Epinard')
laitue = Vegetable.objects.get(name='Laitue')
radis = Vegetable.objects.get(name='Radis')
poireau = Vegetable.objects.get(name='Poireau')

# Bonnes associations
GoodAssociation.objects.create(left_vegetable=choux, right_vegetable=radis, name="Choux et Radis")
GoodAssociation.objects.create(left_vegetable=laitue, right_vegetable=radis, name="Laitue et Radis")
GoodAssociation.objects.create(left_vegetable=poireau, right_vegetable=laitue, name="Poireau et Laitue")

# Mauvaises associations
BadAssociation.objects.create(left_vegetable=choux, right_vegetable=laitue, name="Choux et Laitue")
BadAssociation.objects.create(left_vegetable=epinard, right_vegetable=radis, name="Epinard et Radis")

from django.db import models


class Vegetable(models.Model):
    def __str__(self):
        return self.name
    name = models.CharField(max_length=200)
    family = models.CharField(max_length=200)


class GoodAssociation(models.Model):
    def __str__(self):
        return self.name
    left_vegetable = models.ForeignKey(Vegetable, on_delete=models.CASCADE, related_name='good_left_associations')
    right_vegetable = models.ForeignKey(Vegetable, on_delete=models.CASCADE, related_name='good_right_associations')
    name = models.CharField(max_length=200, blank=True)

class BadAssociation(models.Model):
    def __str__(self):
        return self.name
    left_vegetable = models.ForeignKey(Vegetable, on_delete=models.CASCADE, related_name='bad_left_associations')
    right_vegetable = models.ForeignKey(Vegetable, on_delete=models.CASCADE, related_name='bad_right_associations')
    name = models.CharField(max_length=200, blank=True)
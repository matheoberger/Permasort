from django.db import models


class Vegetable(models.Model):
    def __str__(self):
        return self.name
    name = models.CharField(max_length=200)
    family = models.CharField(max_length=200)
    ground_sowing = models.JSONField(default=list)
    greenhouse_sowing =models.JSONField(default=list)

    def save(self, *args, **kwargs):
        if isinstance(self.ground_sowing, list):
            print("Ground sowing is a list")
            valid_months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
            for month in self.ground_sowing:    
                if month not in valid_months:
                    raise ValueError("Invalid month in ground_sowing list")
            super().save(*args, **kwargs)  # Call the "real" save() method.
        else:
            return

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

class AssociationPlan(models.Model):
    def __str__(self):
        return self.name
    shape=models.JSONField(default=list)

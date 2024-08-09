# Generated by Django 4.2.11 on 2024-08-09 18:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('permasite', '0002_alter_vegetable_family'),
    ]

    operations = [
        migrations.CreateModel(
            name='GoodAssociation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200)),
                ('left_vegetable', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='left_associations', to='permasite.vegetable')),
                ('right_vegetable', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='right_associations', to='permasite.vegetable')),
            ],
        ),
        migrations.DeleteModel(
            name='Association',
        ),
    ]
# Generated by Django 2.1.7 on 2019-03-10 18:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ai4fitapp', '0003_cardioitem_pointitem_workout'),
    ]

    operations = [
        migrations.CreateModel(
            name='WorkoutActivityResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity_results_id', models.IntegerField(default=0)),
                ('workout_activity_id', models.IntegerField(default=0)),
                ('workout_item_id', models.IntegerField(default=0)),
                ('distancedone', models.FloatField(default=0.0)),
                ('speeddone', models.FloatField(default=0.0)),
                ('timedone', models.IntegerField(default=0)),
                ('deleted', models.IntegerField(default=0)),
                ('wactivity_id', models.IntegerField(default=0)),
                ('wactivity_repetition_id', models.IntegerField(default=0)),
                ('wactivity_type', models.CharField(max_length=32)),
                ('wactivity_time', models.IntegerField(default=0)),
                ('wactivity_distance', models.FloatField(default=0.0)),
                ('wactivity_speed', models.FloatField(default=0.0)),
                ('wactivity_label', models.CharField(max_length=32)),
                ('wactivity_comment', models.CharField(max_length=512)),
                ('wactivity_read_comment', models.IntegerField(default=0)),
                ('wactivity_pace', models.IntegerField(default=0)),
                ('wactivity_percentage', models.IntegerField(default=0)),
                ('wactivity_seq', models.IntegerField(default=0)),
                ('wactivity_deleted', models.IntegerField(default=0)),
            ],
        ),
    ]
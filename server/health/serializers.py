from rest_framework import serializers
from .models import Glucose, Medication, DoctorNote

class GlucoseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Glucose
        fields = '__all__'
    
    def create(self, validated_data):
        glucose_entry = Glucose.objects.create(**validated_data)
        return glucose_entry

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'
    
    def create(self, validated_data):
        medication_entry = Medication.objects.create(**validated_data)
        return medication_entry

class DoctorNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorNote
        fields = '__all__'
    
    def create(self, validated_data):
        doctor_note_entry = DoctorNote.objects.create(**validated_data)
        return doctor_note_entry
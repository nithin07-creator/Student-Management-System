from datetime import date
from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "date_of_birth",
            "course",
            "enrollment_date",
            "address",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "enrollment_date", "created_at", "updated_at"]

    # --- Field-level validation (server-side, mirrors client-side checks) ---

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        return value.strip()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        return value.strip()

    def validate_date_of_birth(self, value):
        if value >= date.today():
            raise serializers.ValidationError("Date of birth must be in the past.")
        age = (date.today() - value).days // 365
        if age < 15:
            raise serializers.ValidationError("Student must be at least 15 years old.")
        if age > 100:
            raise serializers.ValidationError("Please check the date of birth.")
        return value

    def validate_email(self, value):
        return value.lower().strip()

    # --- Object-level validation (duplicate check with clear message) ---

    def validate(self, attrs):
        email = attrs.get("email")
        if email:
            qs = Student.objects.filter(email__iexact=email)
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError(
                    {"email": "A student with this email already exists."}
                )
        return attrs

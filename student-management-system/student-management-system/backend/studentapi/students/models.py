from django.db import models
from django.core.validators import RegexValidator


phone_validator = RegexValidator(
    regex=r"^\+?[0-9]{7,15}$",
    message="Phone number must contain 7 to 15 digits, optionally starting with '+'.",
)


class Student(models.Model):
    """
    Represents a single student record.
    Maps to the 'Student' entity described in the project's database design.
    """

    COURSE_CHOICES = [
        ("CSE", "Computer Science Engineering"),
        ("ECE", "Electronics & Communication Engineering"),
        ("MECH", "Mechanical Engineering"),
        ("CIVIL", "Civil Engineering"),
        ("EEE", "Electrical & Electronics Engineering"),
        ("IT", "Information Technology"),
        ("OTHER", "Other"),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=16, validators=[phone_validator])
    date_of_birth = models.DateField()
    course = models.CharField(max_length=10, choices=COURSE_CHOICES, default="OTHER")
    enrollment_date = models.DateField(auto_now_add=True)
    address = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["last_name", "first_name"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

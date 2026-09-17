from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """
    Provides full CRUD for Student records:
      GET    /api/students/          -> list (supports ?search= and ?course=)
      POST   /api/students/          -> create
      GET    /api/students/{id}/     -> retrieve
      PUT    /api/students/{id}/     -> full update
      PATCH  /api/students/{id}/     -> partial update
      DELETE /api/students/{id}/     -> delete
    """

    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["first_name", "last_name", "email", "course"]

    def get_queryset(self):
        qs = super().get_queryset()
        course = self.request.query_params.get("course")
        if course:
            qs = qs.filter(course__iexact=course)
        return qs

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "A student with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError:
            return Response(
                {"detail": "A student with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        name = f"{instance.first_name} {instance.last_name}"
        self.perform_destroy(instance)
        return Response(
            {"detail": f"Student '{name}' was deleted successfully."},
            status=status.HTTP_200_OK,
        )

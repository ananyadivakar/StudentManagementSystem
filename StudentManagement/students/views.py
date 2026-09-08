from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Student
from .serializers import StudentSerializer
from django.shortcuts import get_object_or_404
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

@api_view(['GET', 'POST'])
def student_list(request):

    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
def delete_student(request, id):
    student = get_object_or_404(Student, id=id)
    student.delete()

    return Response(
        {"message": "Student deleted successfully"}
    )


@api_view(['PUT'])
def update_student(request, id):
    student = get_object_or_404(Student, id=id)

    serializer = StudentSerializer(
        student,
        data=request.data
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)
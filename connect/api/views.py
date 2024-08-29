from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from .serializers import ModSerializer
from mods.models import Mod

class ModView(APIView):
    def get(self, request: Request) -> Response:
        mods = Mod.objects.all()
        serializer = ModSerializer(mods, many=True)
        
        return Response(serializer.data)

    def post(self, request: Request) -> Response:
        serializer = ModSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
        
        return Response(serializer.data)
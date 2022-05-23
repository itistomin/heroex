from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from drf_spectacular.utils import extend_schema


USER_TOKENS_TAGS = ['User tokens']
STOCK_TAGS = ['Stock']


@extend_schema(tags=STOCK_TAGS)
class FootballersView(APIView):
    
    def get(self, request):
        return Response(
            {},
            200
        )


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({'detail': 'ok'}, 200)


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenBuyView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(request={})
    def post(self, request):
        return Response({'details': 'Success'}, 201)


@extend_schema(tags=USER_TOKENS_TAGS)
class UserTokenSellView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(request={})
    def post(self, request):
        return Response({'details': 'Success'}, 201)

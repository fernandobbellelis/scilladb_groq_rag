"""
Router for "Hello World" related endpoints.
"""
from sanic import Blueprint
from sanic.request import Request
from sanic.response import HTTPResponse, text


hello_bp = Blueprint("hello_world_routes", url_prefix="/")

@hello_bp.get("/")
async def say_hello(request: Request) -> HTTPResponse:
    """
    Handles GET requests to the root path ("/") within this blueprint
    and returns a simple text response.
    """
    return text("Hello, world from the router!")
"""
Router for "Hello World" related endpoints.
"""
from sanic import Blueprint
from sanic.request import Request
from sanic.response import HTTPResponse, text

# Create a Blueprint. Blueprints are a way to organize groups of related routes.
# The first argument is the blueprint name, which must be unique within the app.
# The `url_prefix` can be used if all routes in this blueprint share a common path prefix.
# For the root endpoint, we don't necessarily need a url_prefix here,
# or we can set it to "/" if we want to be explicit.
hello_bp = Blueprint("hello_world_routes", url_prefix="/")

@hello_bp.get("/")
async def say_hello(request: Request) -> HTTPResponse:
    """
    Handles GET requests to the root path ("/") within this blueprint
    and returns a simple text response.
    """
    # The 'request' parameter is available if needed.
    return text("Hello, world from the router!")
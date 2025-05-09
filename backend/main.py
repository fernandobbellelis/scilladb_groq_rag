"""
Main application file to initialize and run the Sanic server.
"""
from sanic import Sanic

# Import blueprints from the routers directory
from routers.hello_router import hello_bp
# If you add more routers, import their blueprints here:
# from routers.another_router import another_bp

# 1. Initialize the Sanic application
app = Sanic("MyStructuredApp")

# 2. Register the blueprints with the application
# All routes defined in 'hello_bp' will now be active.
app.blueprint(hello_bp)
# If you add more blueprints:
# app.blueprint(another_bp)

# 3. Run the application
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True, auto_reload=True)
    # debug=True enables detailed error pages and auto-reloading on code changes.
    # auto_reload=True explicitly enables auto-reloading (often implied by debug=True).
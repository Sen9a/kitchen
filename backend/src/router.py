from src.api import drone_type_router, communication_type_router, plane_router, user_router

def include_app_routers(app):
    app.include_router(drone_type_router)
    app.include_router(communication_type_router)
    app.include_router(plane_router)
    app.include_router(user_router)
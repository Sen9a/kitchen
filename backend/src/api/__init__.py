from .drone_type import router as drone_type_router
from .communication_type import router as communication_type_router
from .plane import router as plane_router
from .user import router as user_router

__all__ = ["drone_type_router", "communication_type_router", "plane_router", "user_router"]

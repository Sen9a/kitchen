from .base_manager import BaseManager
from src.models import User

class UserManager(BaseManager):
    model: 'User'= User
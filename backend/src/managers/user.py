from .base_manager import BaseManager
from src.models import User

class UserManager(BaseManager):
    def __init__(self):
        super().__init__(model=User)

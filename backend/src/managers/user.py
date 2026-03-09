from .base_manager import BaseManager, FilterOperations
from src.models import User

class UserManager(BaseManager):
    model: 'User'= User
    filter_columns = {'name_ilike': lambda v: {'field': 'name', 'op': FilterOperations.i_like, 'value': v}}
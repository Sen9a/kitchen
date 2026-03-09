from dataclasses import dataclass

from .base_manager import BaseManager, FilterOperations
from src.models import DroneType

@dataclass
class DroneTypeManager(BaseManager):
     model: 'DroneType'= DroneType

     filter_columns = {'name_ilike': lambda v: {'field': 'name', 'op': FilterOperations.i_like, 'value': v}}
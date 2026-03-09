from dataclasses import dataclass

from .base_manager import BaseManager, FilterOperations
from src.models import CommunicationType

@dataclass
class CommunicationTypeManager(BaseManager):
    model: 'CommunicationType'= CommunicationType

    filter_columns = {'name_ilike': lambda v: {'field': 'name', 'op': FilterOperations.i_like, 'value': v}}
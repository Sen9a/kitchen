from dataclasses import dataclass


@dataclass
class DroneType:
    id: int
    name: str

    @classmethod
    def from_orm(cls, drone_type):
        return cls(id=drone_type.id,
                   name=drone_type.name)
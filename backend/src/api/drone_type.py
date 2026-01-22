from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from src.schemas.drone_type import DroneType, DroneTypeCreate, DroneTypeUpdate, DroneTypeRead
from src.services import DroneTypeService

router = APIRouter(prefix="/drone-types", tags=["drone-types"])

@router.post("/", response_model=DroneType, status_code=status.HTTP_201_CREATED)
async def create_drone_type(drone_type: DroneTypeCreate):
    service = DroneTypeService()
    return await service.create(drone_type)

@router.get("/", response_model=List[DroneType])
async def read_drone_types(filter_payload: DroneTypeRead | None = Depends(DroneTypeRead)):
    service = DroneTypeService()
    return await service.get_all(filter_payload)


@router.get("/{drone_type_id}", response_model=DroneType)
async def read_drone_type(drone_type_id: int):
    service = DroneTypeService()
    db_drone_type = await service.get(drone_type_id)
    if db_drone_type is None:
        raise HTTPException(status_code=404, detail="Drone type not found")
    return db_drone_type

@router.put("/{drone_type_id}", response_model=DroneType)
async def update_drone_type(drone_type_id: int, drone_type: DroneTypeUpdate):
    service = DroneTypeService()
    db_drone_type = await service.put(drone_type_id, drone_type)
    if db_drone_type is None:
        raise HTTPException(status_code=404, detail="Drone type not found")
    return db_drone_type

@router.delete("/{drone_type_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_drone_type(drone_type_id: int):
    service = DroneTypeService()
    success = await service.delete(drone_type_id)
    if not success:
        raise HTTPException(status_code=404, detail="Drone type not found")

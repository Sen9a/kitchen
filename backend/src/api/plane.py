from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List

from src.schemas.plane import Plane, PlaneCreate, PlaneUpdate, PlaneRead, PlaneDetails, PlaneBase
from src.services import PlaneService
from src.validation import validate_plane

router = APIRouter(prefix="/planes", tags=["planes"])

@router.post("/", response_model=PlaneCreate, status_code=status.HTTP_201_CREATED)
async def create_plane(name: str = Form(...),
                       plane_type: int | None = Form(...),
                       communication: int | None = Form(...),
                       video_type: int | None = Form(None),
                       image: UploadFile | None = File(None)):
    plane = PlaneCreate(name=name,
                        type=plane_type,
                        communication=communication,
                        video_type_id=video_type)
    service = PlaneService()
    errors = await validate_plane(plane)
    if errors:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=errors)
    return await service.create_plane(plane, image)

@router.get("/", response_model=List[PlaneDetails])
async def read_planes(filter_payload: PlaneRead | None = Depends(PlaneRead)):
    service = PlaneService()
    return await service.get_all(filter_payload)

@router.get("/{plane_id}", response_model=PlaneDetails)
async def read_plane(plane_id: int):
    service = PlaneService()
    plane = PlaneBase(id=plane_id)
    errors = await validate_plane(plane)
    if errors:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=errors)
    db_plane = await service.get(plane_id)
    return db_plane

@router.put("/{plane_id}", response_model=Plane)
async def update_plane(plane_id: int, plane: PlaneUpdate):
    service = PlaneService()
    db_plane = await service.put(plane_id, plane)
    if db_plane is None:
        raise HTTPException(status_code=404, detail="Plane not found")
    return db_plane

@router.delete("/{plane_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_plane(plane_id: int):
    service = PlaneService()
    success = await service.delete(plane_id)
    if not success:
        raise HTTPException(status_code=404, detail="Plane not found")
    return None

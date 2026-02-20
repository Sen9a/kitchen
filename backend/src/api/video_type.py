from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from src.schemas.video_type import VideoType, VideoTypeCreate, VideoTypeUpdate, VideoTypeRead
from src.services import VideoTypeService
from src.validation import validate_video_type

router = APIRouter(prefix="/video-types", tags=["video-types"])


@router.post("/", response_model=VideoType, status_code=status.HTTP_201_CREATED)
async def create_video_type(video_type: VideoTypeCreate):
    service = VideoTypeService()
    errors = await validate_video_type(video_type)
    if errors:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=errors)
    return await service.create(video_type)


@router.get("/", response_model=List[VideoType])
async def read_video_types(filter_payload: VideoTypeRead | None = Depends(VideoTypeRead)):
    service = VideoTypeService()
    return await service.get_all(filter_payload)


@router.get("/{video_type_id}", response_model=VideoType)
async def read_video_type(video_type_id: int):
    service = VideoTypeService()
    db_video_type = await service.get(video_type_id)
    if db_video_type is None:
        raise HTTPException(status_code=404, detail="Video type not found")
    return db_video_type


@router.put("/{video_type_id}", response_model=VideoType)
async def update_video_type(video_type_id: int, video_type: VideoTypeUpdate):
    service = VideoTypeService()
    errors = await validate_video_type(video_type)
    if errors:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=errors)
    db_video_type = await service.put(video_type_id, video_type.model_dump(exclude_unset=True))
    if db_video_type is None:
        raise HTTPException(status_code=404, detail="Video type not found")
    return db_video_type


@router.delete("/{video_type_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_video_type(video_type_id: int):
    service = VideoTypeService()
    success = await service.delete(video_type_id)
    if not success:
        raise HTTPException(status_code=404, detail="Video type not found")
    return None

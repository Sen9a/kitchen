import os
from dataclasses import dataclass
from pathlib import Path

import aiofiles
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool


@dataclass
class FileManager:

    @staticmethod
    async def upload_file(file_path: Path, content: UploadFile) -> Path:
        async with aiofiles.open(str(file_path), "wb") as f:
            while content := await content.read(1024 * 1024):
                await f.write(content)
        return file_path

    @staticmethod
    async def delete_file(file_path: Path) -> bool:
        if file_path:
            await run_in_threadpool(os.remove, file_path)
            return True
        return False

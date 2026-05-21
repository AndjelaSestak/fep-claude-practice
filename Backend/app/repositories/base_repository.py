from typing import Generic, TypeVar

from sqlalchemy.ext.asyncio import AsyncSession

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType]):
    def __init__(self, db: AsyncSession):
        self.db = db

    def add(self, instance: ModelType) -> ModelType:
        self.db.add(instance)
        return instance

    async def refresh(self, instance: ModelType) -> None:
        await self.db.refresh(instance)

    async def flush(self) -> None:
        await self.db.flush()

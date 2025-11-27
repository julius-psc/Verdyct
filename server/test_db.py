import asyncio
from sqlmodel import SQLModel, select
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from models import Project
import os

DATABASE_URL = "sqlite+aiosqlite:///./verdyct_v2.db"
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

async def test_db():
    print("Testing DB creation...")
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    print("DB created.")

    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    print("Testing insertion...")
    async with async_session() as session:
        project = Project(
            name="Test Project",
            raw_idea="Test Idea",
            status="draft",
            report_json={"test": "data"}
        )
        session.add(project)
        await session.commit()
        await session.refresh(project)
        print(f"Project created: {project.id}")
        print(f"Report JSON: {project.report_json}")

    print("Testing selection...")
    async with async_session() as session:
        statement = select(Project)
        result = await session.exec(statement)
        projects = result.all()
        print(f"Projects found: {len(projects)}")
        for p in projects:
            print(f"- {p.name}: {p.report_json}")

if __name__ == "__main__":
    asyncio.run(test_db())

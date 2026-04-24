"""merge recurring and template heads

Revision ID: a3c9f2d8b1e4
Revises: 47b33ce1f79f, 180087c68080
Create Date: 2026-04-23 15:00:00.000000

"""
from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "a3c9f2d8b1e4"
down_revision: Union[str, Sequence[str], None] = ("47b33ce1f79f", "180087c68080")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

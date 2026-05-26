"""merge card report and card fields heads

Revision ID: b7d9c2a4f1e8
Revises: 6a0bf9869db7, dbb56e4e8436
Create Date: 2026-04-21 15:20:00.000000

"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "b7d9c2a4f1e8"
down_revision: Union[str, Sequence[str], None] = ("6a0bf9869db7", "dbb56e4e8436")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

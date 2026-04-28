"""merge timezone and start_date migrations

Revision ID: 43df342d28ae
Revises: 95fb82112965, be9a04d184d0
Create Date: 2026-04-28 18:46:34.328322

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '43df342d28ae'
down_revision: Union[str, Sequence[str], None] = ('95fb82112965', 'be9a04d184d0')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

"""fix_transactiontype_enum_typo

Revision ID: 08c75ee0e9d6
Revises: 180087c68080
Create Date: 2026-04-23 16:10:09.631425

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '08c75ee0e9d6'
down_revision: Union[str, Sequence[str], None] = 'a3c9f2d8b1e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("ALTER TYPE transactiontype RENAME VALUE 'reccuring' TO 'recurring'")

def downgrade():
    op.execute("ALTER TYPE transactiontype RENAME VALUE 'recurring' TO 'reccuring'")


"""add_is_deleted_and_card_fields

Revision ID: 6a0bf9869db7
Revises: 2db3ea3cf09f
Create Date: 2026-04-20 13:43:03.476013

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6a0bf9869db7'
down_revision: Union[str, Sequence[str], None] = '2db3ea3cf09f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('cards', sa.Column('is_deleted', sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column('email_verifications', sa.Column('card_id', sa.Integer(), nullable=True))
    op.create_foreign_key('fk_email_verifications_card_id', 'email_verifications', 'cards', ['card_id'], ['id'])
    op.alter_column('cards', 'card_number_masked', nullable=False)
    op.alter_column('cards', 'card_pin', nullable=False)
    op.alter_column('cards', 'cardholder_name', nullable=False)
    op.alter_column('cards', 'expiry_month', nullable=False)
    op.alter_column('cards', 'expiry_year', nullable=False)


def downgrade() -> None:
    op.alter_column('cards', 'expiry_year', nullable=True)
    op.alter_column('cards', 'expiry_month', nullable=True)
    op.alter_column('cards', 'cardholder_name', nullable=True)
    op.alter_column('cards', 'card_pin', nullable=True)
    op.alter_column('cards', 'card_number_masked', nullable=True)
    op.drop_constraint('fk_email_verifications_card_id', 'email_verifications', type_='foreignkey')
    op.drop_column('email_verifications', 'card_id')
    op.drop_column('cards', 'is_deleted')

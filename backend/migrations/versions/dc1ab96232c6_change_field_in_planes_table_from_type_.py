"""Change field in planes table from type to drone_type

Revision ID: dc1ab96232c6
Revises: 31cbca9f2d64
Create Date: 2026-02-24 11:16:36.648772

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dc1ab96232c6'
down_revision: Union[str, Sequence[str], None] = '31cbca9f2d64'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('planes',
                    'type',
                    new_column_name='drone_type_id',
                    type_=sa.Integer,
                    existing_type=sa.Integer,
                    nullable=True)
    op.alter_column('planes',
                    'communication',
                    new_column_name='communication_id',
                    type_=sa.Integer,
                    existing_type=sa.Integer,
                    nullable=True)

def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('planes',
                    'drone_type_id',
                    new_column_name='type',
                    type_=sa.Integer,
                    existing_type=sa.Integer,
                    nullable=True)
    op.alter_column('planes',
                    'communication_id',
                    new_column_name='communication',
                    type_=sa.Integer,
                    existing_type=sa.Integer,
                    nullable=True)

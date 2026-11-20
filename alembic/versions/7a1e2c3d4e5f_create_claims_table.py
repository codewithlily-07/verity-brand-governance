"""create_claims_table

Revision ID: 7a1e2c3d4e5f
Revises: 6f3baba610cd
Create Date: 2026-11-20 10:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7a1e2c3d4e5f'
down_revision: Union[str, Sequence[str], None] = '6f3baba610cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'claims',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('submission_version_id', sa.String(length=36), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('start', sa.Integer(), nullable=True),
        sa.Column('end', sa.Integer(), nullable=True),
        sa.Column('claim_type', sa.String(length=50), nullable=True),
        sa.Column('verdict', sa.String(length=30), nullable=False),
        sa.Column('evidence_id', sa.String(length=36), nullable=True),
        sa.Column('evidence_excerpt', sa.Text(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('rationale', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=True),
        sa.Column('user_edited_replacement', sa.Text(), nullable=True),
        sa.Column('dismiss_reason', sa.Text(), nullable=True),
        sa.Column('challenge_reason', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['submission_version_id'], ['submission_versions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('claims')


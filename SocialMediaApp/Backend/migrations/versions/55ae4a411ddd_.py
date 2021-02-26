"""empty message

Revision ID: 55ae4a411ddd
Revises: fc5ba16fe22a
Create Date: 2021-02-23 21:27:46.249598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '55ae4a411ddd'
down_revision = 'fc5ba16fe22a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('notifications',
    sa.Column('notfication_id', sa.Integer(), nullable=False),
    sa.Column('notification_for', sa.Integer(), nullable=True),
    sa.Column('actioned_by', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['actioned_by'], ['users.user_id'], ),
    sa.ForeignKeyConstraint(['notification_for'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('notfication_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('notifications')
    # ### end Alembic commands ###

from api import db, ma
# from .statline import StatLine, StatLineSchema

class Player(db.Model):
	__tablename__ = 'players'

	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), nullable=False)
	position = db.Column(db.String(4))
	team = db.Column(db.String(4))

	def __init__(self, name, position, team):
		self.name = name
		self.position = position
		self.team = team

	def __str__(self):
		return f'{self.id} {self.name} {self.position} {self.team}'

class PlayerSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'name', 'position', 'team')

	# stats = ma.Nested(StatLineSchema)


from api import db, ma
from .player import Player, PlayerSchema

class Lineup(db.Model):
	__tablename__ = 'lineups'
	id = db.Column(db.Integer(), primary_key=True)
	user_public_id = db.Column(db.String(50), db.ForeignKey('user.public_id'))
	user = db.relationship("User")
	week = db.Column(db.Integer())
	year = db.Column(db.Integer())
	qb = db.Column(db.Integer())
	rb1 = db.Column(db.Integer())
	rb2 = db.Column(db.Integer())
	wr1 = db.Column(db.Integer())
	wr2 = db.Column(db.Integer())
	wr3 = db.Column(db.Integer())
	te = db.Column(db.Integer())
	flex = db.Column(db.Integer())
	points = db.Column(db.Float())
	bet = db.Column(db.Float())
	winnings = db.Column(db.Float())

	def __init__(self, user_public_id, week, year, bet, winnings):
		self.user_public_id = user_id
		self.week = week
		self.year = year
		self.qb = None
		self.rb1 = None
		self.rb2 = None
		self.wr1 = None
		self.wr2 = None
		self.wr3 = None
		self.te = None
		self.flex = None
		self.points = 0
		self.bet = bet
		self.winnings = winnings

	def __str__(self):
		return f'{self.id} {self.user_public_id} {self.year} {self.week} {self.qb} {self.rb1} {self.rb2} {self.wr1} {self.wr2} {self.wr3} {self.te} {self.flex} {self.points} {self.bet} {self.winnings}'

	def update(self, data):
		for key, value in data.items():
			setattr(self, key, value)
		db.session.commit()

class LineupSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'user_public_id', 'week', 'year', 'qb', 'rb1', 'rb2', 'wr1', 'wr2', 'wr3', 'te', 'flex', 'points', 'bet', 'winnings')


class FullLineupSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'user_public_id', 'week', 'year', 'qb', 'rb1', 'rb2', 'wr1', 'wr2', 'wr3', 'te', 'flex', 'points', 'bet', 'winnings')

	qb = ma.Nested(PlayerSchema)
	rb1 = ma.Nested(PlayerSchema)
	rb2 = ma.Nested(PlayerSchema)
	wr1 = ma.Nested(PlayerSchema)
	wr2 = ma.Nested(PlayerSchema)
	wr3 = ma.Nested(PlayerSchema)
	te = ma.Nested(PlayerSchema)
	flex = ma.Nested(PlayerSchema)





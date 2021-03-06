from api import db, ma
from .player import Player, PlayerSchema
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property

class Lineup(db.Model):
	__tablename__ = 'lineups'
	id = db.Column(db.Integer(), primary_key=True)
	user_public_id = db.Column(db.String(50), db.ForeignKey('user.public_id'))
	user = db.relationship('User', foreign_keys=[user_public_id])
	week = db.Column(db.Integer)
	year = db.Column(db.Integer)
	qb = db.Column(db.Integer)
	rb1 = db.Column(db.Integer)
	rb2 = db.Column(db.Integer)
	wr1 = db.Column(db.Integer)
	wr2 = db.Column(db.Integer)
	wr3 = db.Column(db.Integer)
	te = db.Column(db.Integer)
	flex = db.Column(db.Integer)
	dst = db.Column(db.Integer)
	points = db.Column(db.Float)
	bet = db.Column(db.Float)
	winnings = db.Column(db.Float)
	imported = db.Column(db.Boolean)
	site = db.Column(db.String(30))
	created_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	entry_id = db.Column(db.String(50))
	position = db.Column(db.Integer)
	entries = db.Column(db.Integer)
	tournament_name = db.Column(db.String)

	# def __init__(self, user_public_id, week, year, points, bet, winnings, imported, site,
	# 		entry_id, position, entries, tournament_name):
	# 	self.user_public_id = user_public_id
	# 	self.week = week
	# 	self.year = year
	# 	self.points = points
	# 	self.bet = bet
	# 	self.winnings = winnings
	# 	self.imported = imported
	# 	self.site = site
	# 	self.entry_id = entry_id
	# 	self.position = position
	# 	self.entries = entries
	# 	self.tournament_name = tournament_name

	# 	if entries and position:
	# 		self.percentile = (entries - position) / entries

	def __str__(self):
		return f'{self.id} {self.user_public_id} {self.year} {self.week} {self.qb} {self.rb1} {self.rb2} {self.wr1} {self.wr2} {self.wr3} {self.te} {self.flex} {self.dst} {self.points} {self.bet} {self.winnings}'

	def update(self, data):
		for key, value in data.items():
			setattr(self, key, value)
		db.session.commit()

	# @hybrid_property
	# def percentile(self):
	# 	if self.position is None or self.entries is None:
	# 		return 'TETS'
	# 	else:
	# 		return self.entries - self.position

	@hybrid_property
	def percentile(self):
		if self.entries == None or self.position == None:
			return None
		return (self.entries - self.position) / self.entries

	@percentile.expression
	def percentile(cls):
		return ((cls.entries - cls.position) / cls.entries)
	

class LineupSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'user_public_id', 'week', 'year', 'qb', 'rb1', 'rb2', 
			'wr1', 'wr2', 'wr3', 'te', 'flex', 'dst', 'points', 'bet', 'winnings', 
			'position', 'entries', 'percentile')


class FullLineupSchema(ma.SQLAlchemySchema):
	class Meta:
		fields = ('id', 'user_public_id', 'week', 'year', 'qb', 'rb1', 'rb2', 
			'wr1', 'wr2', 'wr3', 'te', 'flex', 'points', 'bet', 'winnings', 'percentile', 
			'position', 'entries')

	qb = ma.Nested(PlayerSchema)
	rb1 = ma.Nested(PlayerSchema)
	rb2 = ma.Nested(PlayerSchema)
	wr1 = ma.Nested(PlayerSchema)
	wr2 = ma.Nested(PlayerSchema)
	wr3 = ma.Nested(PlayerSchema)
	te = ma.Nested(PlayerSchema)
	flex = ma.Nested(PlayerSchema)
	dst = ma.Nested(PlayerSchema)





from api import db, ma
from .player import Player, PlayerSchema

# Each set of game stats belongs to a specific player
class StatLine(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	player_id = db.Column(db.Integer, db.ForeignKey('player.id'))
	week = db.Column(db.Integer())
	year = db.Column(db.Integer())
	team = db.Column(db.String(4))
	game = db.Column(db.String(10))
	passing_attempts = db.Column(db.Integer())
	passing_completions = db.Column(db.Integer())
	passing_yards = db.Column(db.Integer())
	passing_touchdowns = db.Column(db.Integer())
	passing_interceptions = db.Column(db.Integer())
	passing_2point_conversions = db.Column(db.Integer())
	rushing_attempts = db.Column(db.Integer())
	rushing_yards = db.Column(db.Integer())
	rushing_touchdowns = db.Column(db.Integer())
	rushing_2point_conversions = db.Column(db.Integer())
	receptions = db.Column(db.Integer())
	recieving_yards = db.Column(db.Integer())
	recieving_touchdowns = db.Column(db.Integer())
	recieving_2point_conversions = db.Column(db.Integer())
	fumbles_lost = db.Column(db.Integer())
	fantasy_points = db.Column(db.Float())

	def __init__(self, week: int, year: int, team: str, game: str, passing_attempts: int, passing_completions: int, passing_yards: int,
		passing_touchdowns: int, passing_interceptions: int,
		passing_2point_conversions: int, rushing_attempts: int, rushing_yards: int, rushing_touchdowns: int,
		rushing_2point_conversions: int, receptions: int, recieving_yards: int, recieving_touchdowns: int,
		recieving_2point_conversions: int, fumbles_lost: int, fantasy_points: float) -> None:

		self.week = week
		self.year = year
		self.team = team
		self.game = game
		self.passing_attempts = passing_attempts
		self.passing_completions = passing_completions
		self.passing_yards = passing_yards
		self.passing_touchdowns = passing_touchdowns
		self.passing_interceptions = passing_interceptions
		self.passing_2point_conversions = passing_2point_conversions
		self.rushing_attempts = rushing_attempts
		self.rushing_yards = rushing_yards
		self.rushing_touchdowns = rushing_touchdowns
		self.rushing_2point_conversions = rushing_2point_conversions
		self.receptions = receptions
		self.recieving_yards = recieving_yards
		self.recieving_touchdowns = recieving_touchdowns
		self.recieving_2point_conversions = recieving_2point_conversions
		self.fumbles_lost = fumbles_lost
		self.fantasy_points = fantasy_points

class StatLineSchema(ma.SQLAlchemySchema):
	class Meta:
		model = StatLine

	id = ma.auto_field()
	week = ma.auto_field()
	year = ma.auto_field()
	team = ma.auto_field()
	game = ma.auto_field()
	passing_attempts = ma.auto_field()
	passing_completions = ma.auto_field()
	passing_yards = ma.auto_field()
	passing_touchdowns = ma.auto_field()
	passing_interceptions = ma.auto_field()
	passing_2point_conversions = ma.auto_field()
	rushing_attempts = ma.auto_field()
	rushing_yards = ma.auto_field()
	rushing_touchdowns = ma.auto_field()
	rushing_2point_conversions = ma.auto_field()
	receptions = ma.auto_field()
	recieving_yards = ma.auto_field()
	recieving_touchdowns = ma.auto_field()
	recieving_2point_conversions = ma.auto_field()
	fumbles_lost = ma.auto_field()
	fantasy_points = ma.auto_field()
	player_id = ma.auto_field()






import unittest
from LineupOptimizerControllerModule.LineupBuilderSlot import LineupBuilderSlot

class LineupBuilderSlotTests(unittest.TestCase):

    def test_true(self):
        self.assertTrue(True)

    def test_default_position(self):
        self.assertEqual(["WR"], LineupBuilderSlot("WR2", "draftkings").eligible_positions)
        self.assertEqual(["RB", "WR", "TE"], LineupBuilderSlot("FLEX", "draftkings").eligible_positions)
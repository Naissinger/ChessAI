from re import T
import re
import time
import sys
from stockfish import Stockfish

stockfish = Stockfish("stockfish14\\stockfish_14.1_win_x64_avx2.exe")
stockfish.set_skill_level(25)
stockfish.set_depth(99)

entrada = sys.argv[1::]

if(entrada[0] == "-f"):
    
    stockfish.set_fen_position(entrada[1])
    print(f'Board View:\n\n{stockfish.get_board_visual()}')
    print(f'\nBest Move: {stockfish.get_best_move_time(5000)}\n')


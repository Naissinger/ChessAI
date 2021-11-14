import sys
from stockfish import Stockfish

stockfish = Stockfish("stockfish14\\stockfish_14.1_win_x64_avx2.exe")
stockfish.set_elo_rating(2800)

entrada = sys.argv[1::]

if(entrada[0] == "-f"):
    
    try:
        if(entrada[2] == "-b"):
            entradaSplit = entrada[1].split(" b")
            fen = entradaSplit[0][::-1]
            fen = fen + ' b' + entradaSplit[1]
            print(fen)
            stockfish.set_fen_position(fen)
            print(f'Board View:\n\n{stockfish.get_board_visual()}')
            print(f'\nBest Move: {stockfish.get_best_move_time(2000)}\n')
            print(f'Mate em: {stockfish.get_evaluation()}')
    except:
        stockfish.set_fen_position(entrada[1])
        print(f'Board View:\n\n{stockfish.get_board_visual()}')
        print(f'\nBest Move: {stockfish.get_best_move_time(2000)}\n')
        print(f'Mate em: {stockfish.get_evaluation()}')
elif(entrada[0] == "-m"):

    stockfish.set_fen_position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    bestMove = stockfish.get_best_move_time(1000)
    stockfish.make_moves_from_current_position(["e2e4"])
    stockfish.make_moves_from_current_position([entrada[1]])
    print(f'FEN: {stockfish.get_fen_position()}')


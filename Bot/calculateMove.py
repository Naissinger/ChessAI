import sys
from stockfish import Stockfish

stockfish = Stockfish("stockfish14\\stockfish_14.1_win_x64_avx2.exe")
stockfish.set_elo_rating(3500)
stockfish.set_depth(99)

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
            print(f'\nBest Move: {stockfish.get_best_move_time(100)}\n')
            print(f'Mate em: {stockfish.get_evaluation()}')
        else:
            stockfish.set_fen_position(entrada[1])
            
            print(f'Board View:\n\n{stockfish.get_board_visual()}')
            
            move = stockfish.get_best_move_time(100)
            
            print(f'\nBest Move: {move}\n')
            
            stockfish.make_moves_from_current_position([move])

            print(f'Mate em: {stockfish.get_evaluation()}')
            print(f'FEN: {stockfish.get_fen_position()}')
    except:
        stockfish.set_fen_position(entrada[1])

        print(f'Board View:\n\n{stockfish.get_board_visual()}')

        move = stockfish.get_best_move_time(100)

        print(f'\nBest Move: {move}\n')

        stockfish.make_moves_from_current_position([move])

        print(f'Mate em: {stockfish.get_evaluation()}')
        print(f'FEN: {stockfish.get_fen_position()}')
elif(entrada[0] == "-m"):

    stockfish.set_fen_position(entrada[3])
    stockfish.make_moves_from_current_position([entrada[1]])

    print(f'FEN: {stockfish.get_fen_position()}')


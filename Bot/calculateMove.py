import sys
from stockfish import Stockfish

stockfish = Stockfish("stockfish16\\stockfish-windows-x86-64-avx2.exe")

stockfish.set_skill_level(20)

entrada = sys.argv[1::]

if entrada[0] == "-f":
    try:
        if entrada[2] == "-b":
            entradaSplit = entrada[1].split(" b")
            fen = entradaSplit[0][::-1]
            fen = fen + " b" + entradaSplit[1]

            print(fen)
            stockfish.set_fen_position(fen)

            print(f"\nBest Move: {stockfish.get_best_move()}\n")
            print(f"Mate em: {stockfish.get_evaluation()}")
            print(stockfish.get_board_visual())
        else:
            stockfish.set_fen_position(entrada[1])

            move = stockfish.get_best_move()

            print(f"\nBest Move: {move}\n")

            stockfish.make_moves_from_current_position([move])

            print(f"Mate em: {stockfish.get_evaluation()}")
            print(f"FEN: {stockfish.get_fen_position()}")
            print(stockfish.get_board_visual())
    except:
        stockfish.set_fen_position(entrada[1])
        move = stockfish.get_best_move()

        print(f"\nBest Move: {move}\n")

        stockfish.make_moves_from_current_position([move])

        print(f"Mate em: {stockfish.get_evaluation()}")
        print(f"FEN: {stockfish.get_fen_position()}")
        print(stockfish.get_board_visual())
elif entrada[0] == "-m":
    stockfish.set_fen_position(entrada[3])

    stockfish.make_moves_from_current_position([entrada[1]])

    print(f"FEN: {stockfish.get_fen_position()}")
    print(stockfish.get_board_visual())

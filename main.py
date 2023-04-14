import sys

from webapp.logic.solvers import Manhattan, Chebyshev, Euclidean
from webapp.logic.utils import (
    PZL3,
    PZL4,
    PZL4_EASY,
    PZL4_MEDIUM,
    PZL5,
    PZL5_HARD,
    PZL5_MEDIUM,
    PZL6,
)


def main():
    # расскоментить для ввода из генератора пазлов
    # python2.7 webapp/logic/npuzzle-gen.py 4 -s | python main.py
    if len(sys.argv) == 2:
        k_heuristic = int(sys.argv[1])
        lines = sys.stdin.readlines()
        pzl = [list(map(int, line.split())) for line in lines[2:]]
    else:
        k_heuristic = 1
        pzl = PZL4_EASY

    Manhattan(pzl, print_moves=True, k_heuristic=k_heuristic).run()
    Euclidean(pzl, k_heuristic=k_heuristic).run()
    Chebyshev(pzl, k_heuristic=k_heuristic).run()


if __name__ == "__main__":
    main()

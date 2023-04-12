import sys

from webapp.logic.solvers import Manhattan, Chebyshev, Euclidean
from webapp.logic.utils import PZL3, PZL4, PZL4_MEDIUM, PZL5, PZL5_HARD, PZL5_MEDIUM, PZL6


def main():
    # расскоментить для ввода из генератора пазлов
    # python2.7 webapp/logic/npuzzle-gen.py 4 -s | python3 main.py

    lines = sys.stdin.readlines()
    pzl = [list(map(int, line.split())) for line in lines[2:]]

    # pzl = PZL4_MEDIUM

    # print(pzl)
    # assert(len(solver_manhattan(PZL)) > 1 )
    for i in range(4, 8):
        Manhattan(pzl, optimizator=i).run()
        Euclidean(pzl, optimizator=i).run()
        Chebyshev(pzl, optimizator=i).run()


if __name__ == "__main__":
    main()

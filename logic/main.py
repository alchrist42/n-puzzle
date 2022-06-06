from re import I
import sys
from solvers import Manhattan, Chebyshev, Euclidean
from utils import PZL3, PZL3_START, PZL3_MOD, PZL4, PZL4_MOD, PZL4_MEDIUM, PZL5, PZL5_HARD, PZL5_MEDIUM, PZL6
from checker import check_puzzle


def main():
    # python2.7 npuzzle-gen.py 4 -s | python3.10 main.py

    # расскоментить для ввода из генератора пазлов
    # lines = sys.stdin.readlines()
    # pzl = [list(map(int, line.split())) for line in lines[2:]]

    pzl = PZL6
    i = 1
    # Euclidean(pzl, optimizator=i).run()
    Manhattan(pzl, optimizator=i).run()
    # Chebyshev(pzl, optimizator=i).run()

    # for puzzle in [ PZL3, PZL3_START, PZL3_MOD, PZL4, PZL4_MEDIUM, \
    #                 PZL4_MOD, PZL5, PZL5_HARD, PZL5_MEDIUM, PZL6]:
    #     print(".", end="")
    #     assert check_puzzle(puzzle) == True

    # print("Solvable" if check_puzzle(pzl) else "NOT Solvable")
    # for name, pzl in enumerate([PZL3_START, PZL4, PZL4_MEDIUM, PZL5]):
    #     print("solv N", name)
    #     for i in range(0, 8, 2):
    #         Manhattan(pzl, optimizator=i).run()
    #         Chebyshev(pzl, optimizator=i).run()
    #         Euclidean(pzl, optimizator=i).run()


if __name__ == "__main__":
    main()

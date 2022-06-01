from re import I
import sys
from solvers import Manhattan, Chebyshev, Euclidean
from utils import PZL4, PZL5, PZL5_HARD, PZL5_MEDIUM, PZL6



def main():
    # python2.7 npuzzle-gen.py 4 -s | python3.10 main.py

    # расскоментить для ввода из генератора пазлов
    # lines = sys.stdin.readlines()
    # pzl = [list(map(int, line.split())) for line in lines[2:]]

    pzl = PZL5

    # print(pzl)
    # assert(len(solver_manhattan(PZL)) > 1 )
    for i in range(6):
        Manhattan(pzl, optimizator=i).run()
        Chebyshev(pzl, optimizator=i).run()
        Euclidean(pzl, optimizator=i).run()


if __name__ == "__main__":
    main()

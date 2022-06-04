import sys
from utils import make_goal_map, conver_to_dct, get_zero_pos


def check_puzzle(pzl):
    s = len(pzl)
    digits = sum(pzl, [])
    # проверяем что вообще пазл содержит правильные числа
    if len(digits) != s**2 or sorted(digits) != list(range(s**2)):
        return None
    hlp = make_goal_map(s)
    dhlp = conver_to_dct(hlp)

    # сначала раскладываем числа в порядке "улитки"
    digits = []
    for key in list(range(1, s**2)) + [0]:
        pos = dhlp[key]
        digits.append(pzl[pos.row][pos.col])

    # считаем кол-во пар (invariations), где справа число меньше чем слева
    pairs = 0
    for i, x in enumerate(digits):
        for y in digits[i + 1 :]:
            pairs += x and y and x > y

    # затем хитровыебанным способом считаем 'ряд' для пустой клетки
    # два часа времени убито на эти две строки
    # zero = get_zero_pos(pzl)
    # if s % 2:
    #     zero_row =0
    # else:
    #     zero_row =0
    #     pass
        # zero_row = zero.row + zero.col - dhlp[0].row - dhlp[0].col
        # zero_row = (s ** 2 - 1 - digits.index(0)) % 2

    # пазл имеет решение если кол-во пар + ряд пустой клетки четны
    return pairs % 2 == 0


if __name__ == "__main__":
    # python2.7 npuzzle-gen.py 4 | python3.10 checker.py

    lines = sys.stdin.readlines()
    solv = "is solvable" in lines[0]
    pzl = [list(map(int, line.split())) for line in lines[2:]]
    print(solv, check_puzzle(pzl))
    assert check_puzzle(pzl) == solv

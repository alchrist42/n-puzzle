import sys
from .utils import make_goal_map, conver_to_dct, get_zero_pos


def check_pazzle(pzl):
    s = len(pzl)
    digits = sum(pzl, [])
    # проверяем что вообще пазл содержит правильные числа
    if len(digits) != s**2 or sorted(digits) != list(range(s**2)):
        return False
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
    zero = get_zero_pos(pzl)
    zero_row = zero.row + zero.col - dhlp[0].row - dhlp[0].col

    # пазл имеет решение если кол-во пар + ряд пустой клетки четны
    return (pairs + zero_row) % 2 == 0


if __name__ == "__main__":
    # python2.7 npuzzle-gen.py 4 | python3.10 checker.py

    lines = sys.stdin.readlines()
    solv = "is solvable" in lines[0]
    print(solv)
    pzl = [list(map(int, line.split())) for line in lines[2:]]
    assert check_pazzle(pzl) == solv

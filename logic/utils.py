from collections import namedtuple

PZL3 = [[3, 6, 4], [2, 0, 7], [1, 5, 8]]
PZL3_START = [[6, 7, 3], [2, 0, 5], [4, 8, 1]]
PZL3_MOD = [[6, 0, 3], [2, 7, 5], [4, 8, 1]]
PZL4 = [[4, 0, 10, 12], [6, 9, 8, 15], [13, 11, 3, 5], [2, 1, 7, 14]]
PZL4_MEDIUM = [[5, 3, 2, 12], [7, 4, 10, 8], [9, 15, 1, 0], [14, 11, 13, 6]]
PZL4_MOD = [[1, 15, 2, 4], [7, 0, 3, 5], [11, 13, 14, 6], [10, 9, 8, 12]]
PZL5 = [
    [4, 15, 23, 19, 22],
    [16, 9, 6, 3, 20],
    [5, 1, 17, 18, 24],
    [12, 14, 7, 2, 11],
    [0, 21, 8, 13, 10],
]
PZL5_MEDIUM = [
    [7, 12, 21, 14, 11],
    [5, 6, 22, 8, 1],
    [17, 18, 15, 10, 23],
    [2, 0, 13, 24, 3],
    [4, 19, 9, 16, 20],
]
PZL5_HARD = [
    [0, 5, 20, 18, 4],
    [14, 9, 11, 21, 13],
    [2, 24, 19, 1, 15],
    [6, 7, 10, 16, 8],
    [22, 17, 12, 23, 3],
]
PZL6 = [
    [21, 14, 19, 2, 11, 8],
    [34, 23, 26, 31, 16, 1],
    [3, 20, 10, 27, 28, 18],
    [7, 25, 4, 32, 0, 24],
    [13, 29, 5, 6, 15, 30],
    [12, 9, 35, 22, 17, 33],
]



Pos = namedtuple("Pos", "row col")


def make_goal_map(s):
    hlp = [[-1] * s for _ in range(s)]
    cur = 1
    row = col = 0
    ir, ic = 0, 1
    while cur != s**2:
        hlp[row][col] = cur
        if col + ic == s or col + ic < 0 or (ic and hlp[row][col + ic] != -1):
            ir, ic = ic, 0
        if row + ir == s or row + ir < 0 or (ir and hlp[row + ir][col] != -1):
            ic, ir = -ir, 0
        row += ir
        col += ic
        cur += 1
    hlp[row][col] = 0
    return hlp


def get_zero_pos(pzl):
    for row, line in enumerate(pzl):
        if 0 in line:
            return Pos(row, line.index(0))
    raise Exception("no zero in pzl")


def conver_to_dct(pzl):
    dct = {}
    for row, line in enumerate(pzl):
        for col, cell in enumerate(line):
            dct[cell] = Pos(row, col)
    return dct


def str_pzl(pzl):
    return "".join(map(str, sum(pzl, [])))

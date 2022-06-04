from time import time
from copy import deepcopy, copy
from bisect import insort_left

from utils import Pos, make_goal_map, get_zero_pos, conver_to_dct, str_pzl


class Solver:
    def __init__(self, pzl, optimizator=0):
        self.name = None
        self.pzl = pzl
        self.s = len(pzl)
        self.optimizator=optimizator
        self.max_steps = 0
        self.len_cache = 0
        self.iteration = 0
        self.start_time = time()

    def evristic(a: Pos, b: Pos):
        pass

    def run(self):
        z = get_zero_pos(self.pzl)
        helper = make_goal_map(self.s)
        dhlp = conver_to_dct(helper)
        dpzl = conver_to_dct(self.pzl)

        start_dist = sum(self.evristic(dpzl[x], dhlp[x]) for x in dpzl)
        cnt = 0
        passed = {str_pzl(self.pzl)}
        steps = [(start_dist, cnt, z, self.pzl, [])]
        k = 1 / max(2, 8 - self.optimizator)
        dsts = set()  # todo для отладки
        for iter_count in range(0, 10**20):
            self.max_steps = max(self.max_steps, len(steps))
            dist, cnt, z, pzl, moves = steps.pop()
            if abs(dist) < 0.0001:
                self.moves = moves
                self.len_cache = len(passed)
                self.iteration = iter_count
                self.spend_time = round(time() - self.start_time, 3)
                self.print_mertics(cnt)
                return
            poss = [
                Pos(z.row - 1, z.col),
                Pos(z.row + 1, z.col),
                Pos(z.row, z.col + 1),
                Pos(z.row, z.col - 1),
            ]
            # фильтруем только по допустым ходам, от 2 до 4
            poss = filter(
                lambda x: x.row != -1
                and x.row != self.s
                and x.col != -1
                and x.col != self.s,
                poss,
            )
            for pos in poss:
                val = pzl[pos.row][pos.col]
                new_pzl = deepcopy(pzl)
                dist_val = self.evristic(pos, dhlp[val]) - self.evristic(z, dhlp[val])
                dist_zero = self.evristic(z, dhlp[0]) - self.evristic(pos, dhlp[0])
                # новое 'расстояние' между целевым и текущим полем
                new_dist = dist - (dist_val + dist_zero)
                new_pzl[z.row][z.col] = val
                new_pzl[pos.row][pos.col] = 0
                # Если такой вариант пазла еще не добавляли в возможные ходы
                if str_pzl(new_pzl) not in passed:
                    passed.add(str_pzl(new_pzl))
                    new_moves = copy(moves)
                    new_moves.append((val, pos, z))
                    # Ход вставляется в отсортированный список. где в конце - ходы с наименьшей дистанцией до цели и наименьшим кол-вом движений от начала игры
                    if self.optimizator:
                        insort_left(
                            steps,
                            (new_dist, cnt + 1, pos, new_pzl, new_moves),
                            key=lambda x: -(x[0] + x[1] * k),
                        )
                    else:
                        insort_left(
                            steps,
                            (new_dist, cnt + 1, pos, new_pzl, new_moves),
                            key=lambda x: -x[0],
                        )

            # if not iter_count % 100000 and iter_count:
            #     # print(cnt, -steps[-1][0])
            #     print(
            #         f"{cnt} steps\n{iter_count} iteration\n{max_steps} max_steps\n{steps[-1][0]} next_dist"
            #     )

            # if dist not in dsts:
            #     dsts.add(dist)
            #     print("dist to solved: ", dist)

    def print_mertics(self, cnt):
        print("\n\tSolved!")
        print("Evristic name".ljust(20), self.name)
        print("Optimizator koof".ljust(20), self.optimizator)
        print("Moves".ljust(20), cnt)
        print("Checks".ljust(20), self.iteration)
        print("Cache lenght".ljust(20), self.len_cache)
        print("Max lenght queue".ljust(20), self.max_steps)
        print("Spended time".ljust(20), self.spend_time)

    @classmethod
    def print_pzl(pzl):
        w = len(str(len(pzl) ** 2))  # длина максимального числа в пазле
        for line in pzl:
            print(*[str(x).rjust(w) for x in line])


class Manhattan(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Manhattan distance"

    def evristic(self, a: Pos, b: Pos):
        return abs(a.col - b.col) + abs(a.row - b.row)


class Chebyshev(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Chebyshev distance"

    def evristic(self, a: Pos, b: Pos):
        return max(abs(a.col - b.col), abs(a.row - b.row))


class Euclidean(Solver):
    def __init__(self, *args, **kvargs):
        super().__init__(*args, **kvargs)
        self.name = "Euclidean distance"

    def evristic(self, a: Pos, b: Pos):
        return ((a.col - b.col) ** 2 + (a.row - b.row) ** 2) ** 0.5
